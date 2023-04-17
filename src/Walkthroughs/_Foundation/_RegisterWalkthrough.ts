import { Constructor } from "temp-circuits";
import { Mcq_Walkthroughs } from "../../Mcq_Walkthroughs";

export function RegisterWalkthrough():any
{
    return function(constructor: Constructor<any>)
    {
        Mcq_Walkthroughs.registerWalkthrough(new constructor());
        return constructor;
    }

}