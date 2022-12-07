import { Exception_InvalidOperation } from "../_DotNet";
import { Constructor } from "..";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { getGlobalInfoObject } from "../DI/DI";
import { NodeBlueprint } from "./NodeBlueprint";


export class CircuitBlueprint
{
    static _outMissingTypesInRegistration(isTypeRegistered: (t: Constructor<BaseCircuit>)=>boolean, outUnregisterdTypes: Constructor[])
    {
        const checkedTypes: any[] = [];

        for(let type of this.dct_Type_CircuitBluePrint.xKeys())
        {
            const _surfaceOutMissingTypesInRegistration = (type: Constructor)=>
            {
                const getMissingRegisration = (type: Constructor) =>
                {
                    checkedTypes.xAdd(type);
    
                    const circuitBluePrint = this.dct_Type_CircuitBluePrint.xGet(type);
                    if(!circuitBluePrint?.nodeBlueprints) return;

                    for(let nodeBluePrint of circuitBluePrint!.nodeBlueprints)
                    {
                        if(!nodeBluePrint.nodeTypeProvider) continue;
    
                        const interfaceType = nodeBluePrint.nodeTypeProvider();
                        if(checkedTypes.xContains(interfaceType)) continue;
    
                        if(!isTypeRegistered(interfaceType))
                        {
                            outUnregisterdTypes.xAdd(interfaceType);
                            _surfaceOutMissingTypesInRegistration(interfaceType);
                        }

                    }
                };
    
                getMissingRegisration(type);
            };

            _surfaceOutMissingTypesInRegistration(type);
        }
        
    }

    static getNodeNamesOf(constructor: any): string[]
    {
        const typeChain: Constructor[] = [];
        typeChain.xAdd(constructor);
        let stepBase = constructor;
        while(true)
        {
            stepBase = Object.getPrototypeOf(stepBase);
            if(stepBase == null) break;
            typeChain.xAdd(stepBase);
        }

        const nodes = typeChain.xSelect(t => this.dct_Type_CircuitBluePrint.xGet(t))
                                .xExcept([undefined])
                                .xSelectMany(bluePrint => bluePrint!.nodeBlueprints);

        return nodes.xSelect(n=>n.nodeName);

        const circuitBluePrint = this.dct_Type_CircuitBluePrint.xGet(constructor);
        return circuitBluePrint?.nodeBlueprints.xSelect(n => n.nodeName) ?? [];
    }
    private static dct_Type_CircuitBluePrint: Map<Constructor<any>, CircuitBlueprint> = new Map();

    static provideBlueprintsForBrowser()
    {
        getGlobalInfoObject().blueprint = this.dct_Type_CircuitBluePrint;
    }

    static addNode(circuitType: Constructor<any>, 
                   nodeName: string, 
                   initializer: Function|null,
                   nodeTypeProvider: (()=>Constructor<any>)|null)
    {
        this.dct_Type_CircuitBluePrint.xEnsure(circuitType, new CircuitBlueprint(circuitType), false)
            .nodeBlueprints.xAdd(new NodeBlueprint(nodeName, initializer, nodeTypeProvider));
    }

    static doesTypeHaveNodes(circuitType: Constructor)
    {
        return this.dct_Type_CircuitBluePrint.xContainsKey(circuitType);
    }

    //current
    static addTrigger(bubbleCatcherType: Constructor<any>, 
                            bubblerTypeFactory: ()=>Constructor<any>, 
                            methodName: string, 
                            expression: string): void
    {
        

        function throwNotFollowingNode()
        {
            throw new Exception_InvalidOperation(`The trigger method ${bubbleCatcherType.name}.${methodName} must come directly after a @Terminal() decorated property in class definition.`);
        }
        const circuitBlueprint = this.dct_Type_CircuitBluePrint.xGet(bubbleCatcherType);
        // recall: A circuit blueprint is initialized at running the first decorator @Node of a type.
        if (circuitBlueprint == null || circuitBlueprint.nodeBlueprints.xAny() === false)
        {
            throwNotFollowingNode();
        }

        const node = circuitBlueprint!.nodeBlueprints.xLast();

        if(node.isForSubCircuit)
        {
            throw new Exception_InvalidOperation(`[@Circuit() ${circuitBlueprint!.CircuitType.name}.${node.nodeName}] cannot be followed by a 'calculator' method. Only @Terminal() decorated properties could followed by a calculator. Recall that, a method is marked as a calculator by being decorated by one or more @Trigger() decorator.`);
        }

        // recall: If the last Node has already got a calculator after it, then this one is not following a @Node decorated property
        if (node.calculatorName !== null &&
            node.calculatorName !== methodName)
        {
            throwNotFollowingNode();
        }

        

        node.calculatorName = methodName;
        node.RecalcIgnitorExpressions.xAdd(expression);
        //current%
        //BubblingType: circuitType, NodeName: expression
        node.addBubbler(bubblerTypeFactory, expression);

    }

    // static AddCalculator(circuitType: Constructor<any>, methodName: string)
    // {
    //     function throwNotFollowingNode()
    //     {
    //         throw new Exception_InvalidOperation(`The method decorated as a @Calculator ${circuitType.name}.${methodName} doesn't directly follow a property decorated by @Node`);
    //     }

    //     const circuitBlueprint = this.dct_Type_CircuitBluePrint.xGet(circuitType);
    //     // recall: A circuit blueprint is initialized at running the first decorator @Node of a type.
    //     if (circuitBlueprint == null || circuitBlueprint.nodeBlueprints.xAny() == false)
    //     {
    //         throwNotFollowingNode();
    //     }

    //     // recall: If the last Node is already got a calculator after it, then this one is not following a @Node decorated property
    //     else if (circuitBlueprint!.nodeBlueprints.xLast().calculatorName != null)
    //     {
    //         throwNotFollowingNode();
    //     }

    //     circuitBlueprint!.nodeBlueprints.xLast().calculatorName = methodName;
    // }

    nodeBlueprints: NodeBlueprint[] = [];

    constructor(public CircuitType: Constructor<any>)
    {
    }

    getNodeBlueprint(nodeName: string): NodeBlueprint
    {
        return this.nodeBlueprints.xFirst(n => n.nodeName === nodeName);
    }

    static getBlueprintOf(circuitType: Constructor<any>): CircuitBlueprint | undefined
    {
        const output = this.dct_Type_CircuitBluePrint.xGet(circuitType);
        if(output == null)
        {
            const x = 0;
        }
        return output;
    }
}

(globalThis as any).blueprints =  (CircuitBlueprint as any).dct_Type_CircuitBluePrint;