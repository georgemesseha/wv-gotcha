import { Constructor, Exception_ArgumentInvalid, Exception_ArgumentNull, Exception_InvalidOperation, Exception_InvalidProgramState, Guid, TypeInfo } from "../_DotNet";

import { Scope } from "./Scope";
import { CircuitBlueprint } from "../Blueprints/CircuitBlueprint";
import { setNodeValue } from "../Decorators/_Terminal";
import { BaseCircuit, UniCircuit } from "../BaseCircuits/BaseCircuits";
import { SubCircuitAssignement } from "../Internals/SubCircuitAssignment";

export let powerOnStarted = false;
export let powerOnComplete = false;

const GLOBAL_KEY_GlobalInfoObject = "lapp";
export function getGlobalInfoObject(): any
{
    var g = globalThis as any;
    if (g[GLOBAL_KEY_GlobalInfoObject] == null) { g[GLOBAL_KEY_GlobalInfoObject] = []; }
    return g[GLOBAL_KEY_GlobalInfoObject] as [];
}

export class DI 
{
    private static provideLogicalAppGlobalInfo()
    {
        const globalInfoObj = getGlobalInfoObject();
        const getMapping = (key: Constructor): {} =>
        {
            return { Key: key.name, Impl: this.dct_key_implAndScop.xGet(key)!.impl!.name };
        };
        globalInfoObj.uniCircuits = this.uniCircuits;
        globalInfoObj.injectionMap = this.dct_key_implAndScop.xKeys().xSelect(getMapping);
        CircuitBlueprint.provideBlueprintsForBrowser();
    }

    static uniCircuits:UniCircuit[] = [];
    private static readonly dct_key_implAndScop: Map<Constructor, { impl: Constructor<BaseCircuit>, scope: Scope }> = new Map();

    static register<TKey extends Constructor<BaseCircuit>, TImpl extends TKey>(interfaceType: TKey, implType: TImpl)
    {
        //#region validation
        //------------------------------------------
        if (!interfaceType) { throw new Exception_ArgumentNull('interfaceType'); }
        if (!implType) { throw new Exception_ArgumentNull('implType'); }

        const isInterfaceACircuit = TypeInfo.of(BaseCircuit).isAssignableFrom(interfaceType);
        const isImplementationACircuit = TypeInfo.of(BaseCircuit).isAssignableFrom(implType);

        if (!isInterfaceACircuit) {
            throw new Exception_ArgumentInvalid(`interfaceType`, interfaceType, `The provided type must be a Circuit derivative.`);
        }
        if (!isImplementationACircuit) {
            throw new Exception_ArgumentInvalid(`implType`, implType, `The provided type must be a Circuit derivative.`);
        }

        const isInterfaceUniCircuit = TypeInfo.of(UniCircuit).isAssignableFrom(interfaceType);
        const isImplUniCircuit = TypeInfo.of(UniCircuit).isAssignableFrom(implType);
        if (isInterfaceUniCircuit && !isImplUniCircuit)
        {
            throw new Exception_ArgumentInvalid(`implType`, implType, `implType must be a UniCircuit derivative as the interfaceType is a UniCircuit derivative!`);
        }
        else if (!isInterfaceACircuit && isImplUniCircuit)
        {
            throw new Exception_ArgumentInvalid(`implType`, implType, `implType must NOT be a UniCircuit derivative as the interfaceType is NOT a UniCircuit derivative!`);
        }

        if (powerOnStarted) {
            throw new Exception_InvalidOperation(`All dependency registration must be done before invoking MotherBoard.powerOn()`);
        }

        if (this.dct_key_implAndScop.xContainsKey(interfaceType)) {
            throw new Exception_InvalidOperation(`Type [${interfaceType.name}] is already registered as an interface type through MotherBoard.register()`);
        }
        //------------------------------------------
        // #endregion validation

        //#region getting injection specs
        //------------------------------------------
        let injectionSpecs!: { impl: Constructor<BaseCircuit>, scope: Scope };
        if (isInterfaceUniCircuit)
        {
            injectionSpecs = { impl: implType, scope: Scope.Singleton };
        }
        else
        {
            injectionSpecs = { impl: implType, scope: Scope.Transient };
        }
        //------------------------------------------
        //#endregion

        this.dct_key_implAndScop.xAdd(interfaceType as unknown as Constructor<object>, injectionSpecs);

        return this;
    }

    static getRegInfoOfKey(keyType: Constructor<BaseCircuit>)
    {
        return this.dct_key_implAndScop.xGet(keyType);
    }

    static powerOn()
    {
        const unregisteredTypes: Constructor[] = [];
        CircuitBlueprint._outMissingTypesInRegistration(t=>this.dct_key_implAndScop.xContainsKey(t), unregisteredTypes);

        if(unregisteredTypes.xAny())
        {
            console.error(`The following circuit types must be registered as interface types through Motherboard.register() calls at the very start of your app.`);
            unregisteredTypes.xForeach(t => console.error(t.name));
            throw new Exception_InvalidOperation('end of list');
        }

        this.provideLogicalAppGlobalInfo();

        const atLeastOneUniCircuitRegistered = this.dct_key_implAndScop.xKeys().xAny(k => TypeInfo.of(UniCircuit).isAssignableFrom(k));
        if(!atLeastOneUniCircuitRegistered) {
            throw new Exception_InvalidOperation(`At lease one UniCircuit derivative must be registered using Motherboard.register() method before invoking Motherboard.powerOn()`);
        }

        powerOnStarted = true;
        
        const keyTypes = this.dct_key_implAndScop.xKeys();
        for (let keyType of keyTypes)
        {
            const regInfo = this.dct_key_implAndScop.xGet(keyType)!;

            if (regInfo.scope === Scope.Singleton)
            {
                const uniCircuit = this.resolve(regInfo.impl) as UniCircuit;
                this.uniCircuits.xAdd(uniCircuit);
            }
        }

        for(let uniCircuit of this.uniCircuits)
        {
            if(! uniCircuit.nodes) { continue; }

            for (let node of uniCircuit.nodes)
            {
                if(node.isSubCircuit === false) { continue; }
                uniCircuit.__deeplyInstallSubcircuits();
            }
        }

        for(let uniCircuit of this.uniCircuits)
        {
            uniCircuit.__deeplyInvokeOnInt();
        }

        // console.log('[[[[[[[[[[[[[[[[[[[[[[[ POWERED ON ]]]]]]]]]]]]]]]]]]]]]]]]]');

        powerOnComplete = true;

    }
    
    // static getSingleton(type: Constructor<BaseCircuit>)
    // {
    //     const singleton = this.uniCircuits.xFirstOrNull(c => c.constructor === type);
    //     if(!singleton)
    //     {
    //         throw new Exception_InvalidProgramState(`DI.uniCircuits`, `Type ${type.name} wasn't found in DI.uniCircuits`);;
    //     }
    // }

    // static resolve<T extends BaseCircuit>(keyType: Constructor<T>): T 
    // {
    //     if(!powerOnStarted)
    //         throw new Exception_InvalidOperation(`Motherboard.powerOn() must be invoked before attempt to resolve a Circuit.`);

    //     const regInfo = this.getRegInfoOfKey(keyType);
    //     if(!regInfo)
    //         throw new Exception_InvalidOperation(`No Circuit interface type is registered as [${keyType.name}]`);

    //     if(regInfo!.scope == Scope.Singleton)
    //     {
    //         return this.getSingleton(regInfo.impl) as unknown as T;
    //     }
    //     else
    //     {
    //         const transientCircuit = new regInfo.impl();
    //         transientCircuit.__deeplyInstallSubcircuits();
    //         return transientCircuit as unknown as T;
    //     }
    // }

    
    private static _applyInitializers(circuit: BaseCircuit)
    {
        const circuitType = circuit.constructor;
        const circuitBluePrint = CircuitBlueprint.getBlueprintOf(circuitType as Constructor);
        if(!circuitBluePrint) { return; }

        const nodeBlueprints = circuitBluePrint!.nodeBlueprints;
        for(let nodeBluePrint of nodeBlueprints)
        {
            if(!nodeBluePrint.initializer) { continue; }

            const value = nodeBluePrint.initializer();
            circuit.getNode(nodeBluePrint.nodeName).setSilentValue(value);
        }
    }

    static resolve(type: Constructor<BaseCircuit>): BaseCircuit
    {
        const regInfo = this.dct_key_implAndScop.xGet(type);
        if(!regInfo) {
            throw new Exception_InvalidOperation(`Type [${type.name}] is not registered through Motherboard.register() method at the very start of your app!`);
        }

        if(regInfo.scope === Scope.Singleton)
        {
            let existing = this.uniCircuits.xFirstOrNull(t => t.constructor === regInfo.impl) as UniCircuit;
            if(!existing)
            {
                existing = new regInfo.impl() as UniCircuit;
                this._applyInitializers(existing);
            }
            return existing;
        }
        else
        {
            const circuit = new regInfo.impl();
            this._applyInitializers(circuit);
            
            if(powerOnComplete)
            {
                const nodeBluePrints = CircuitBlueprint.getBlueprintOf(this as Constructor)?.nodeBlueprints;
                if(nodeBluePrints)
                {
                    for(let nodeBluePrint of nodeBluePrints)
                    {
                        if(!nodeBluePrint.isForSubCircuit) { continue; }
                        const subCircuitType = nodeBluePrint.nodeTypeProvider!();
                        const subCircuit = DI.resolve(subCircuitType);
                        (circuit as any)[nodeBluePrint.nodeName] = new SubCircuitAssignement(subCircuit);
                    }
        
                }

                circuit.onInit();
            }

            return circuit;
        }

        
    }

}

