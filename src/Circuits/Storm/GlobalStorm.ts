import { DateTime, Exception_InvalidOperation, TypeInfo } from "../_DotNet";
import { isAngularApp } from "..";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";
import { Parenter } from "../Parenting/Parenter";
import { GlobalStormLog } from "./GlobalStormLog";
import { LocalStorm } from "./LocalStorm";
import { NodeChange } from "./NodeChange";

export class GlobalStorm
{
    static current: GlobalStorm|null = null;

    static shelveChange(circuit: BaseCircuit, change: NodeChange): void
    {
        if(this.current == null) throw new Exception_InvalidOperation("ShelveChange must be invoked only while there is a GlobalStorm running");
        this.current._shelvedChanges.xEnsure(circuit, [], false).xAdd(change);
    }

    private log = new GlobalStormLog();

    static recentlyCompleted: GlobalStorm|null = null;

    enqueueLocalStorm(lStorm: LocalStorm): void
    {
        this.log.addToCurrentIteration(lStorm);
    }


    private  _shelvedChanges: Map<BaseCircuit, NodeChange[]> = new Map();

    acceptGlobalChanges(finalChanges: Map<BaseCircuit, NodeChange[]>): void 
    {
        for(let circuit of finalChanges.xKeys())
        {
            circuit.acceptGlobalStormChanges();
        }
    }

    private _announceGlobalStormResult(finalChanges: Map<BaseCircuit, NodeChange[]> ): void
    {
        for(let circuit of finalChanges.xKeys())
        {
            circuit.onGotChangesInGlobalStorm(finalChanges.xGet(circuit)!);
        }

    }

    static start(initialChanges: Map<BaseCircuit, NodeChange[]>): void
    {
        this.current = new GlobalStorm();
        this.current.log.newEmptyIteration();

        for(let circuit of initialChanges.xKeys())
        {
            var localStorm = new LocalStorm(circuit, initialChanges.xGet(circuit)!);
            this.current.log.addToCurrentIteration(localStorm);
        }

        this.current.log.localStormsToRunNext.xForeach(l => l.Start());
        
        while(this.current._shelvedChanges.xAny())
        {
            var shelvedChanges = this.current._shelvedChanges.xClone();
            this.current._shelvedChanges = new Map();
            this.current.log.newIterationFromShelf(shelvedChanges);
            this.current.log.localStormsToRunNext.xForeach(l => l.Start());
        }

        this.recentlyCompleted = this.current;

        // If the client code handles PropertyChanged event of a Circuit while
        // an active GlobalStrom is running, this would result in changes that
        // will fire on AnnounceGlobalStormResult.
        // These changes should start a new GlobalStorm.
        var finalChanges = this.current.log.getFinalChanges();
        this.current.acceptGlobalChanges(finalChanges);
        this.current.invalidateViews(finalChanges);
        this.current._announceGlobalStormResult(finalChanges);
        this.current = null;
    }

    invalidateViews(finalChanges: Map<BaseCircuit, NodeChange[]>)
    {
        const changedCircuits = finalChanges.xKeys();
        const ancestors = changedCircuits.xSelectMany(c => Parenter.of(c).getAncestors())
                                         .xOfType(BaseCircuit);

        const circuitsToCheck = changedCircuits.xUnion(ancestors)
                                               .xDistinct();

        const viewsToUpdate = circuitsToCheck.xSelectMany(c=>c._views)
                                             .xDistinct();



        for(let view of viewsToUpdate)
        {
            const v = view as any;
            if(v.forceUpdate)
            {
                console.warn('trying to update view ' + v.constructor.name)
                try
                {
                    v.setState({lastUpdateTime: DateTime.Now})
                    v.forceUpdate();
                }
                catch(err)
                {
                    console.error(err);
                }
            }
            else if(isAngularApp())
            {
                const w = globalThis as any;
                try
                {
                    //v.refresh();
                    // alert('w.ng?.applyChanges(view);');
                    w.ng?.applyChanges(view);
                }
                catch(err)
                {
                    console.error(err);
                }
            }
        
        }


        
    }
}