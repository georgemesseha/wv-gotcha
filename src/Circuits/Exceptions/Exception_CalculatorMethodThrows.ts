import { Exception } from "../_DotNet"
import { Constructor } from ".."

export class Exception_CalculatorMethodThrows extends Exception
{
	constructor(circuitType: Function, calcMethodName: string, innerException: Exception)
	{
        super(`The calculator method ${circuitType.name}.${calcMethodName} throws `, innerException);
	}

	
}

