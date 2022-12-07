
export class CircuitNode
{
    PreLocalStormValue: any = undefined;

    PreGlobalStormValue:any = undefined;

    CurrentValue:any = undefined;

    constructor(public NodeName: string, public isSubCircuit: boolean) 
    {

    }
    
    get ChangedInCurrentLocalStorm() { return this.CurrentValue != this.PreLocalStormValue };
    get ChangedInCurrentGlobalStorm() { return this.CurrentValue != this.PreGlobalStormValue };

    AdmitLocalStormChanges(): void
    {
        this.PreLocalStormValue = this.CurrentValue;
    }

    AdmitGlobalStormChanges(): void
    {
        this.PreGlobalStormValue = this.CurrentValue;
    }

    setSilentValue(newValue: any)
    {
        this.PreGlobalStormValue = this.PreLocalStormValue = this.CurrentValue = newValue;
    }
}