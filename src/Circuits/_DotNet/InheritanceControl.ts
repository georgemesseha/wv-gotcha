import { Constructor } from '..'
export class InheritanceControl
{
    static freezeDataProperty(obj: any, propName: any)
    {
        Object.defineProperty(obj, propName, {
            value: obj[propName],
        }); // `writable`, `configurable`, and `enumerable` all default to `false`
    }
    
    static forceNoOverride(instance: any, type: Constructor<any>, methodName: any, errorMsg: string) 
    {
        if (instance[methodName] !== type.prototype[methodName])
        {
            throw new Error(errorMsg);
        }
        this.freezeDataProperty(instance, methodName);
    }

}