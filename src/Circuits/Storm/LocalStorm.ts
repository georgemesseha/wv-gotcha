import { Exception } from "../_DotNet";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { Exception_CalculatorMethodThrows } from "../Exceptions/Exception_CalculatorMethodThrows";
import { ChangeSet } from "./ChangeSet";
import { LocalStormLog } from "./LocalStormLog";
import { NodeChange } from "./NodeChange";

export class LocalStorm
{
    LocalStormLog: LocalStormLog;

    // public CircuitProxy!: CircuitProxy;

    constructor(public circuit: BaseCircuit, initialChanges: NodeChange[])
    {
        // this.CircuitProxy = circuitProxy;
        this.LocalStormLog = new LocalStormLog(circuit, initialChanges);
    }

    get LastChangeSet():ChangeSet { return this.LocalStormLog.LastChangeSet };

    private _DoIteration():void
	{
		this.LocalStormLog.InitializeNewChangeSet();

		for(let node of this.circuit.nodes)
		{
			const calculator = this.circuit.getCalculatorOf(node.NodeName, this.LocalStormLog.PreviousChangeSet);
            if(!calculator) continue;

            const oldValue = node.CurrentValue;
            let newValue = undefined;

			try
			{
				newValue = calculator.call(this.circuit, this.LocalStormLog.PreviousChangeSet);
			}
			catch (error)
			{
				throw new Exception_CalculatorMethodThrows(this.circuit.constructor, calculator.name, Exception.FromError(error as Error));
			}

            if (newValue !== oldValue)
            {
                node.CurrentValue = newValue;
                this.LocalStormLog.AddToCurrentChangeset(new NodeChange(node.NodeName, oldValue, newValue));
            }
		}
	}

	

    FinalChanges: NodeChange[] = [];

    private _GetFinalChanges(): NodeChange[]
	{
		const output: NodeChange[] = [];
		for (let node of this.circuit.nodes.xWhere(n => n.ChangedInCurrentLocalStorm))
		{
			var oldValue = node.PreLocalStormValue;
			var newValue = node.CurrentValue;

			if (newValue !== oldValue)
			{
				output.xAdd(new NodeChange(node.NodeName, oldValue, newValue));
			}
		}

		return output;
	}

    Start(): void
	{
		do
		{
			this._DoIteration();
		}
		while (this.LocalStormLog.IsResolved === false);

		this.FinalChanges = this._GetFinalChanges();

		if (this.FinalChanges.xAny())
		{
			this.circuit.acceptLocalStormChanges();
            this.circuit.onLocalStormResolved(new ChangeSet(this.circuit, this.FinalChanges));
			this.circuit.bubbleUp(new ChangeSet(this.circuit, this.FinalChanges));
        }
    }
}