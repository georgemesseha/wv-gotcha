import { Exception_ArgumentInvalid, TypeInfo } from "../_DotNet";
import { BaseCircuit } from "../BaseCircuits/BaseCircuits";

import { BubbleInfo } from "../Storm/BubbleInfo";
import { NodeChange } from "./NodeChange";

export class PathExpression
{
    constructor(expression: string) 
    {
        this.Steps = expression.split('.').xSelect(x=>x.trim());
    }

    public readonly Steps: string[];

    public MatchesRealNodeName(refCircuit: BaseCircuit, 
                               targetCircuit:BaseCircuit, 
                               nodeNameToCheck: string): boolean
    {
        if(nodeNameToCheck !== this.Steps.xLast()) return false;
        if(targetCircuit.hasNodeName(nodeNameToCheck) === false) return false;

        if(refCircuit === targetCircuit) return true; 

        for(let i=0; i<this.Steps.length-1; i++)
        {
            const step = this.Steps[i];

            refCircuit = (refCircuit as any)[step];
            if(refCircuit === null) return false;
        }

        return(refCircuit === targetCircuit);
    }

}

export class ChangeSet
{
    constructor(public source: any, public changes: NodeChange[])
    {
        // if(changes?.xAny() !== true)
        // {
        //     throw new Exception_ArgumentInvalid('changes', changes, 'changes cannot be null or empty')
        // }
    }
 
    containsAnyOf(nodeNames: string[]): boolean
    {
        if(!this.changes) return false;
        return this.changes!.xSelect(ch => ch.NodeName).xIntersect(nodeNames).xAny();
    }

    isSourceCircuitOneOf(circuits: BaseCircuit[]): boolean
    {
        return circuits.xAny(c => c === this.source);
    }

    private expressionMatchesAnyChange(exp:string, refCircuit: BaseCircuit): boolean
    {
        const expression = new PathExpression(exp);
        return this.changes.xAny(ch => expression.MatchesRealNodeName(refCircuit, this.source as BaseCircuit, ch.NodeName)); 
        
    }

    // matchesAnyExpression(refCircuit: Circuit, expressions:string[]): boolean
    // {
    //     if(refCircuit == this.source)
    //     {
    //         return expressions.xIntersect(this.changes.xSelect(nCh=>nCh.NodeName)).xAny();
    //     }

    //     for(let exp of expressions)
    //     {
    //         if(this.expressionMatchesAnyChange(exp, refCircuit)) return true;
    //     }

    //     return false;
    // }

    //current
    matchesAnyBubbler(bubbles: BubbleInfo[]): boolean
    {
        for(let bubble of bubbles)
        {
            if(this.source.constructor !== bubble.BubblingTypeFactory()) continue;
            
            for(let change of this.changes)
            {
                
                if(bubble.NodeName === change.NodeName)
                {
                    return true;
                }
            }
        }

        return false;
    }
}