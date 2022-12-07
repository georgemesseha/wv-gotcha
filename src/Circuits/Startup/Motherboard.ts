import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { Constructor } from "..";
import { DI } from "../DI/DI";
// import { DI } from "../DI/DI";

export class Motherboard
{
    static workspace?: string;

    static powerOn(workspace: string)
    {
       this.workspace = workspace;
       DI.powerOn();
    }

    static register<TKey extends Constructor<BaseCircuit>, TImpl extends TKey>(interfaceType: TKey, implType: TImpl)
    {
        DI.register(interfaceType, implType);
        return this;
    }
}