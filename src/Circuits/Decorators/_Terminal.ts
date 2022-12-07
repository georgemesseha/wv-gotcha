import { Exception_InvalidOperation, isPrimitive, TypeInfo } from "../_DotNet";
import { UniCircuit } from "..";
import { powerOnComplete } from "../DI/DI";
import { Parenter } from "../Parenting/Parenter";
import { GlobalStorm } from "../Storm/GlobalStorm";
import { NodeChange } from "../Storm/NodeChange";
import { CircuitBlueprint } from "../Blueprints/CircuitBlueprint";
import { Scope } from "../DI/Scope";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";


export function setNodeValue(circuit: BaseCircuit, propertyKey: string, value: any)
{
    const node = circuit.getNode(propertyKey);

    const oldValue = node.CurrentValue;
    if (value === oldValue) { return; }

    if(!powerOnComplete)
    {
        node.setSilentValue(value);
        return;
    }

    //----------------------------------------------------
    if (isPrimitive(oldValue) === false)
    {
        Parenter.of(oldValue).removeParentIfAny(propertyKey, circuit);
    }
    if (isPrimitive(value) === false)
    {
        Parenter.of(value).ensureParent(propertyKey, circuit);
    }
    //----------------------------------------------------

    const change = new NodeChange(node.NodeName, oldValue, value);
    node.CurrentValue = value;


    if (GlobalStorm.current != null)
    {
        GlobalStorm.shelveChange(circuit, change);
    }
    else
    {
        const changedNodes: Map<BaseCircuit, NodeChange[]> = new Map();
        changedNodes.xAdd(circuit, [change]);
        GlobalStorm.start(changedNodes);
    }
}


export function Terminal(): any
{
    return function (target: any, propertyKey: string, desc: any)
    {
        CircuitBlueprint.addNode(target.constructor, propertyKey, desc?.initializer, null);

        return {
            set: function (value: any)
            {
                if(value)
                {
                    if(TypeInfo.of(BaseCircuit).isAssignableFrom(value.constructor))
                    {
                        throw new Exception_InvalidOperation(`At [@Terminal() ${target.constructor.name}.${propertyKey}]: Cannot assign a Circuit to a terminal. Use @Circuit() decorator to implicitly assign a sub circuit to a Circuit.`);
                    }
                    if(TypeInfo.of(Array).isAssignableFrom(value.constructor))
                    {
                        const arr = value as [];
                        if(arr.xAny(item => TypeInfo.of(BaseCircuit).isAssignableFrom(value.constructor)))
                        {
                            throw new Exception_InvalidOperation(`At [@Terminal() ${target.constructor.name}.${propertyKey}]: The array value cannot have Circuits. To assign an array of circuits as sub-circuits to a parent Circuit, use @Cardset() decorator instead of @Terminal()`);
                        }
                    }
                }
                
                setNodeValue((this as unknown as BaseCircuit), propertyKey, value);
            },
            get: function ()
            {
                const node = (this as unknown as BaseCircuit).getNode(propertyKey);
                return node.CurrentValue;
            }
        };
    };
}


