import { Constructor, Exception_InvalidOperation, TypeInfo } from "..";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { CircuitBlueprint } from "../Blueprints/CircuitBlueprint";

export function Trigger<TCircuit extends BaseCircuit>(bubbleSourceTypeFactory: ()=>Constructor<TCircuit>, expression: ((x: TCircuit) => any))
{
    return function (target: any, propertyKey: string, desc: any)
    {
        const bubbleCatcherType = target.constructor;
        if(TypeInfo.of(BaseCircuit).isAssignableFrom(bubbleCatcherType) == false)
        {
            throw new Exception_InvalidOperation(`class ${bubbleCatcherType.name} is not a sub-class of BaseCircuit. Only BaseCircuit derivative classes could have @Trigger() decorator for it's properties.`);
        }

        let barberedExpression = expression.toString();
        barberedExpression = barberedExpression.xSubstring(barberedExpression.xIndexOf('.') + 1);
        //current
        CircuitBlueprint.addTrigger(bubbleCatcherType, bubbleSourceTypeFactory, propertyKey, barberedExpression);
    };
}