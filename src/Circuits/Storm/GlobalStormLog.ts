
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { LocalStorm } from "./LocalStorm";
import { NodeChange } from "./NodeChange";

export class GlobalStormLog
{
    private _log: LocalStorm[][] = [];

    newEmptyIteration()
    {
        this._log.xAdd([]);
    }

    addToCurrentIteration(lStorm:LocalStorm): void
    {
        this._log.xLast().xAdd(lStorm);
    }

    get reachedSteadyState() { return this._log.xLast().xCount() === 0; }

    get localStormsToRunNext(): LocalStorm[] { return this._log.xLast(); }

    newIterationFromShelf(shelvedChanges: Map<BaseCircuit, NodeChange[]>): void
    {
        const circuits = shelvedChanges.xKeys();
        for (let circuit of circuits)
        {
            const lStrom = new LocalStorm(circuit, shelvedChanges.xGet(circuit)!);
            this.addToCurrentIteration(lStrom);
        }
    }

    getFinalChanges(): Map<BaseCircuit, NodeChange[]>
    {
        const changes = new Map<BaseCircuit, NodeChange[]>();

        const circuitsToCheck = this._log.xSelectMany(ls => ls).xSelect(l => l.circuit).xDistinct();
        for(let circuit of circuitsToCheck)
        {
            const nodeChanges = circuit.getChangesInGlobalStorm();
            if(nodeChanges.xAny())
            {
                changes.xAdd(circuit, nodeChanges);
            }
        }

        return changes;
    }
    
}