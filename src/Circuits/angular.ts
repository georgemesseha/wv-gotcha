// @ts-ignore
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { InheritanceControl } from "./_DotNet/InheritanceControl";
import { TransientCircuit } from '.'
// @ts-ignore
import { RequiredValidator } from "@angular/forms";
import { DateTime, Exception_InvalidOperation } from "./_DotNet";
// @ts-ignore
import { NgClass } from "@angular/common";
export declare interface xInput {
    /**
     * The name of the DOM property to which the input property is bound.
     */
    bindingPropertyName?: string;
}


@Component({
    selector: 'circuit-view',
    template: `
      <p>This will not display</p>
      `,
    styles: [
    ]
})
export class CircuitView<TCircuit extends TransientCircuit>
{
    private Id = DateTime.Now.toString();
    
    constructor() 
    {
        InheritanceControl.forceNoOverride(this, CircuitView, 'ngOnInit', `At {{ override ${this.constructor.name}.ngOnInit() }}: You cannot not override ngOnInt(). Instead you may override circuitViewOnInit() to get the exact same expected result!`);
        InheritanceControl.forceNoOverride(this, CircuitView, 'ngOnDestroy', `At {{ override ${this.constructor.name}.ngOnDestroy() }}: You cannot not override ngOnDestroy(). Instead you may override circuitViewOnDestroy() to get the exact same expected result!`);
    }
    
    circuitViewOnInit(): void {}
    ngOnInit():void
    {
        if(!this.circuit)
        {
            throw new Exception_InvalidOperation(`A CircuitView of type [${this.constructor.name}] hasn't been passed a Circuit.`)
        }
        
        this.circuit.attachView(this);
        this.circuitViewOnInit();
    }
    
    circuitViewOnDestroy(): void {}
    ngOnDestroy(): void
    {
        console.warn(`Component to detach Id = ${this.Id}`)
        this.circuit.detachView(this);
        this.circuitViewOnDestroy();
    }
    
    @Input()
    // @ts-ignore
    circuit!: TCircuit;
}


// @ts-ignore