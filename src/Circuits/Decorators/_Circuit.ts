import { Exception_InvalidOperation, TypeInfo, Constructor } from "../_DotNet";
import { CircuitBlueprint } from "../Blueprints/CircuitBlueprint";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { SubCircuitAssignement } from "../Internals/SubCircuitAssignment";
import { Parenter } from "../Parenting/Parenter";


export function Circuit(nodeTypePredicate:()=>Constructor<Object>):any
{
    return function(target: any, propertyKey: string, desc: any)
    {
        if(desc?.initializer) { throw new Exception_InvalidOperation(`Property @AutoSetNode() [${target.constructor.name}.${propertyKey}] has an initializer. AutoSetNode() decorated property cannot have initializer.`); }
        CircuitBlueprint.addNode(target.constructor, propertyKey, null, nodeTypePredicate);

        return {
            set: function (value: any)
            {
                const isSubCircuitAssignment = TypeInfo.of(SubCircuitAssignement).isAssignableFrom(TypeInfo.ofObject(value));
                if(isSubCircuitAssignment === false)
                {
                    throw new Exception_InvalidOperation(`An assignment to [${target.constructor.name}].[@Circuit()${propertyKey}] detected. Sub-circuits are assigned only once automatically by Circuits framework.`);
                }

                const parentCircuit = this as unknown as BaseCircuit;
                const subCircuit = (value as SubCircuitAssignement).circuit;
                parentCircuit.getNode(propertyKey).setSilentValue(subCircuit);
                Parenter.of(subCircuit).ensureParent(propertyKey, parentCircuit);
            },
            get: function ()
            {
                const circuit = this as unknown as BaseCircuit;
                return circuit.getNode(propertyKey).CurrentValue;
            }
        };
    };
}