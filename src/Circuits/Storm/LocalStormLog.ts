import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { ChangeSet } from "./ChangeSet";
import { NodeChange } from "./NodeChange";

export class LocalStormLog
{
    constructor(public circuit: BaseCircuit, initialChanges:NodeChange[]) 
    {
        this._Log.xAdd(initialChanges);        
    }

    private _Log:NodeChange[][] = [];

    InitializeNewChangeSet(): void
	{
		this._Log.xAdd([]);
	}

    AddToCurrentChangeset(propertyChange: NodeChange)
	{
		this._Log.xLast().xAdd(propertyChange); 
	}

    get IsResolved(): boolean { return this._Log.xAny() === false || this._Log.xLast().xAny() === false };

    get LastChangeSet(): ChangeSet { return new ChangeSet(this.circuit, this._Log.xLast()) };

    get PreviousChangeSet(): ChangeSet { return new ChangeSet(this.circuit, this._Log[this._Log.length - 2]) };

}