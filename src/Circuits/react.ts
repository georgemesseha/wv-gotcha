
import { Exception_InvalidOperation } from "./_DotNet";
// @ts-ignore
import { Component } from "react";
import { TransientCircuit } from ".";
import { InheritanceControl } from "./_DotNet/InheritanceControl";

export class CircuitView<IProps extends { circuit: TransientCircuit }>
    extends Component<IProps>
{
    constructor(props: IProps) 
    {
        super(props);

        if (!(props.circuit))
        {
            throw new Exception_InvalidOperation(`A CircuitView of type [${this.constructor.name}] didn't receive a circuit as a property!`);
        }

        InheritanceControl.forceNoOverride(this, CircuitView, 'componentDidMount', 
        `At {{ override ${this.constructor.name}.componentDidMount() }}: You cannot not override componentDidMount(). Instead you may override circuitViewDidMount() to get the exact same expected result.`)        

        InheritanceControl.forceNoOverride(this, CircuitView, 'componentWillUnmount', 
        `At {{ override ${this.constructor.name}.componentWillUnmount() }}: You cannot not override componentWillUnmount(). Instead you may override circuitViewWillUnmount() to get the exact same expected result.`)        
    }

    circuitViewDidMount(): void {}
    // @ts-ignore
    override componentDidMount(): void
    {
        this.circuit.attachView(this);
        this.circuitViewDidMount();
    }

    circuitViewWillUnmount(): void {}
    // @ts-ignore
    override componentWillUnmount(): void
    {
        this.circuit.detachView(this);
        this.circuitViewWillUnmount();
    }

    // @ts-ignore
    get circuit() { return this.props.circuit; }
}
