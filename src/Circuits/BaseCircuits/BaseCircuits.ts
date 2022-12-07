import { Constructor, Exception_InvalidOperation } from '../_DotNet';
import { DateTime, TypeInfo } from "../_DotNet";
import { Circuit, isAngularApp } from "..";
import { CircuitBlueprint } from "../Blueprints/CircuitBlueprint";
import { setNodeValue } from "../Decorators/_Terminal";
import { ChangeSet } from "../Storm/ChangeSet";
import { CircuitNode } from "../Storm/CircuitNode";
import { NodeChange } from "../Storm/NodeChange";
import { Parenter } from '../Parenting/Parenter';
import { DI } from '../DI/DI';
import { SubCircuitAssignement } from '../Internals/SubCircuitAssignment';
// import { TransientCircuit } from './TransientCircuit';


export class BaseCircuit
{
    // __isFullyInstalled = false;

    private _nodeDictionary: Map<string, CircuitNode> = new Map();
    ensureNode(nodeName: string, isSubCircuit: boolean): CircuitNode
    {
        const output = this._nodeDictionary.xEnsure(nodeName, new CircuitNode(nodeName, isSubCircuit), false);
        return output;
    }

    getNode(nodeName: string): CircuitNode
    {
        return this._nodeDictionary.xGet(nodeName)!;
    }

    get nodes(): CircuitNode[]
    {
        return this._nodeDictionary.xValues();
    }

    _views: any[] = [];

    // static _nextCircuitId = 0;

    circuitId!: number;

    static isCircuit(obj: any): boolean
    {
        if (obj == null) return false;

        return TypeInfo.of(BaseCircuit).isAssignableFrom(obj.constructor);
    }

    constructor()
    {
        const nodeBluePrints = CircuitBlueprint.getBlueprintOf(this.constructor as Constructor)?.nodeBlueprints;
        if(nodeBluePrints)
        {
            for (let nodeBluePrint of nodeBluePrints)
            {
                this.ensureNode(nodeBluePrint.nodeName, nodeBluePrint.isForSubCircuit);
            }
        }
        
    }

    getNodeValue(nodeName: string)
    {
        return this.getNode(nodeName);
    }

    acceptLocalStormChanges(): void
    {
        this.nodes.xForeach(n => n.AdmitLocalStormChanges());
    }

    acceptGlobalStormChanges(): void
    {
        this.nodes.xForeach(n => n.AdmitGlobalStormChanges());
    }

    static resolve<T>(this: Constructor<T>)
    {
        return DI.resolve(this as unknown as Constructor<BaseCircuit>) as unknown as T;
    }

    bubbleUp(changeSet: ChangeSet)
    {
        const ancestors = Parenter.of(this).getAncestors();
        if(!ancestors.xContains(this)) ancestors.xAdd(this);
        
        for (let a of ancestors)
        {
            if (BaseCircuit.isCircuit(a) === false)
                continue;

            (a as BaseCircuit).recalculateTriggeredNodes(changeSet);
        }
    }

    hasNodeName(nodeName: string)
    {
        return this.nodes.xAny(n => n.NodeName === nodeName);
    }

    onLocalStormResolved(changeSet: ChangeSet)
    {
    }

    onGotChangesInGlobalStorm(changes: NodeChange[])
    {
        if (TypeInfo.of(BaseCircuit).isAssignableFrom(TypeInfo.ofObject(this)))
        {
            this.onGotChangesInGlobalStrom(new ChangeSet(this, changes));
        }
    }

    getChangesInGlobalStorm(): NodeChange[]
    {
        return this.nodes.xWhere(n => n.ChangedInCurrentGlobalStorm)
            .xSelect(n => new NodeChange(n.NodeName, n.PreGlobalStormValue, n.CurrentValue));
    }


    recalculateTriggeredNodes(changeSet: ChangeSet)
    {
        for (let node of this.nodes)
        {
            const calculator = this.getCalculatorOf(node.NodeName, changeSet);
            if (calculator)
            {
                const newValue = calculator.call(this, changeSet);
                setNodeValue(this, node.NodeName, newValue);
            }
        }
    }

    getCalculatorOf(nodeName: string, changeSet: ChangeSet): Function | null
    {
        const circuitBluePrint = CircuitBlueprint.getBlueprintOf(this.constructor as Constructor);

        if (circuitBluePrint == null)
        {
            return null;
        }
        const nodeBluePrint = circuitBluePrint!.getNodeBlueprint(nodeName);

        if (nodeBluePrint.Bubblers?.xAny() !== true)
            return null;
        // if(!changeSet.matchesAnyExpression(this.DummyCircuit, nodeBluePrint.RecalcIgnitorExpressions)) return null;
        if (!changeSet.matchesAnyBubbler(nodeBluePrint.Bubblers))
            return null;
        const calcName = nodeBluePrint.calculatorName;

        return calcName ? (this as any)[nodeBluePrint.calculatorName!] : null;
    }

    attachView(view: any)
    {
        this._views.xEnsureItem(view);
    }

    detachView(view: any)
    {
        this._views.xRemoveWhere(v => v === view);
    }

    invalidateViews()
    {
        for (let view of this._views)
        {
            if (view.forceUpdate)
            {
                console.warn('trying to update view ' + view.constructor.name);
                try
                {
                    view.setState({ lastUpdateTime: DateTime.Now });
                    if (view.IView)
                    {
                        view.forceUpdate();
                    }
                }
                catch (err)
                {
                    console.error(err);
                }
            }
            else if (isAngularApp())
            {
                const w = globalThis as any;
                try
                {
                    view.refresh();
                    // alert('w.ng?.applyChanges(view);');
                    // w.ng?.applyChanges(view);
                }
                catch (err)
                {
                    console.error(err);
                }
            }
        }
    }

    onInit(): void
    {
    }

    isInitialized: boolean = false;

    nameOf<T extends BaseCircuit>(type: Constructor<T>, propertySelector: ((obj: T) => any))
    {
        const exp = propertySelector.toString();
        if (exp.xContains(".") === false)
        {
            return exp.xSubstring(exp.indexOf("()=>") + 1);
        }
        return exp.xSubstring(exp.xLastIndexOf(".") + 1);
    }

    __deeplyInstallSubcircuits()
    {
        const nodeBluePrints = CircuitBlueprint.getBlueprintOf(this.constructor as Constructor)?.nodeBlueprints;
        if(!nodeBluePrints) return;

        const subCircuits:BaseCircuit[] = [];
        for(let nodeBluePrint of nodeBluePrints)
        {
            if(!nodeBluePrint.isForSubCircuit) continue;
            if(this.getNode(nodeBluePrint.nodeName).CurrentValue) continue;

            const subCircuitType = nodeBluePrint.nodeTypeProvider!();
            const subCircuit = DI.resolve(subCircuitType);
            (this as any)[nodeBluePrint.nodeName] = new SubCircuitAssignement(subCircuit);
            subCircuits.xAdd(subCircuit);
        }

        for(let subCircuit of subCircuits)
        {
            subCircuit.__deeplyInstallSubcircuits();
        }
    }

    __deeplyInvokeOnInt()
    {
        if(this.isInitialized) return;

        this.isInitialized = true;
        this.onInit();

        if(!this.nodes) { return; }

        for(let node of this.nodes)
        {
            if(!node.isSubCircuit) { continue; }

            else { (node.CurrentValue as BaseCircuit).__deeplyInvokeOnInt(); }
        }
    }

    onGotChangesInGlobalStrom(changeSet: ChangeSet): void
    {
    }
}

export class UniCircuit extends BaseCircuit
{
    constructor() {
        super();

        if(this.constructor.name === 'U_Container')
        {
            let x = 0;
        }

        if(DI.uniCircuits.xAny(t=> t.constructor === this.constructor))
            throw new Exception_InvalidOperation(`An attempt to re-instantiate a singleton of ${this.constructor.name}`);
        
    }

    // static single<T>(this: Constructor<T>): T
    // {
    //     return DI.resolve(this as unknown as Constructor<BaseCircuit>) as unknown as T;
    // }

    onLogicalAppInitialized()
    {

    }
}

export class TransientCircuit extends BaseCircuit
{

}

