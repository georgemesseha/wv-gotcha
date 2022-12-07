import { Constructor } from "..";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { BubbleInfo } from "../Storm/BubbleInfo";


export class NodeBlueprint
{
    RecalcIgnitorExpressions: string[] = [];

    Bubblers: BubbleInfo[] = [];

    constructor(public readonly nodeName: string,
        public readonly initializer: Function | null,
        public readonly nodeTypeProvider: (() => Constructor<any>) | null)
    {
    }

    get isForSubCircuit() { return this.nodeTypeProvider != null; }

    addBubbler(bubblerCircuitTypeFactory: () => Constructor<BaseCircuit>, nodeName: string): void
    {
        const bubbler = new BubbleInfo(bubblerCircuitTypeFactory, nodeName);
        this.Bubblers.xAdd(bubbler);
    }

    calculatorName: string | null = null;
}
