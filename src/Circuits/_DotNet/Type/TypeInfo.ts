
import { Constructor } from "..";
import { Exception, Exception_ArgumentNull, Exception_InvalidProgramState } from "../Exceptions/Exceptions";

export class TypeInfo
{ 
    private constructor(public readonly Type: Function)
    {

    }

    public static of(type: Function|TypeInfo): TypeInfo
    {
        return (type as TypeInfo).Type? type as TypeInfo : new TypeInfo(type as Function);
    }

    public isAssignableFrom(type: Function|TypeInfo)
    {
        if(!type) { throw new Exception_ArgumentNull('type'); }

        let stepConstructor:Function;
        if(type.constructor === TypeInfo)
        {
            stepConstructor = (type as TypeInfo).Type;
        }
        else
        {
            stepConstructor = type as Function;
        }
        
        if(!type) throw new Exception_InvalidProgramState('typeConstructor', 'typeConstructor should not be null here!');

        do
        {
            if(this.Type === stepConstructor)
            {  
                return true;
            }

            stepConstructor = Object.getPrototypeOf(stepConstructor);
        }
        while(stepConstructor);

        return false;
    }

    public static GetDecoratedConstructor(constructor: Constructor): Constructor
    {
        while(!!constructor && !constructor.name)
        {
            constructor = Object.getPrototypeOf(constructor);
        }

        return constructor;
    }

    public static ofObject(obj: any): TypeInfo
    {
        if(!obj) throw new Exception_ArgumentNull('obj');

        let type = obj.constructor;
        while(!!type && !type.name)
        {
            type = Object.getPrototypeOf(type);
        }

        return new TypeInfo(type);
    }

    public get typeName(): string
    {
        return this.Type.name;
    }
}