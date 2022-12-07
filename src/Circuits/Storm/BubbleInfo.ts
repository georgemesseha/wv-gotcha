import { Constructor } from "..";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";



export class BubbleInfo
{
    constructor(public BubblingTypeFactory: () => Constructor<BaseCircuit>, public NodeName: string) { }
}
