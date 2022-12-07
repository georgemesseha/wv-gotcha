export class Exception extends Error
{
    constructor(message:string, public readonly innerException:Exception|null = null)
    {
        super(message);
        this.logError();
    }

    static FromError(error: Error): Exception
    {
        return new Exception(error.message);
    }

    logError()
	{
        this.innerException?.logError();
        console.error(this.message);
        console.error(this.stack);
	}
}
export class Exception_ArgumentInvalid extends Exception
{
    constructor(public readonly argumentName:string, 
                public readonly value:any, 
                public readonly description:string|null = null,
                innerException:Exception|null = null)
    {
        super(`Invalid argument: {${argumentName} = ${value}} is invalid.\r\n${description}`, innerException);       
    }
}
export class Exception_InvalidOperation extends Exception
{
    constructor(message:string, 
                innerException:Exception|null = null)
    {
        super(message, innerException);       
    }
}
export class Exception_ArgumentNull extends Exception
{
    argumentName!: string;

    constructor(argumentName: string, message:string|null = null, innerException:Exception|null = null)
    {
        super(message ?? `Argument '${argumentName}' cannot be null!`, innerException);       
        this.argumentName = argumentName;
    }
}
export class Exception_UnintendedExecutionPath extends Exception
{
    constructor(message:string, innerException:Exception|null = null)
    {
        super(message, innerException);       
    }
}
export class Exception_InvalidProgramState extends Exception
{
    constructor(invalidVarName:string, 
                public readonly description:string, 
                innerException:Exception|null = null)
    {
        super(`Invalid program state at var:${invalidVarName}\r\n ${description}`, innerException);       
    }
}
