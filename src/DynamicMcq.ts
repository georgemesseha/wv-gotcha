import { Mcq } from "./Mcq";

export class DynamicMcq extends Mcq<string>
{
    constructor(private readonly _options: string[])
    {
        super();
    }

    protected get _deduceOptionText(): (option: string) => string
    {
        return option => option;
    }
    protected get options(): string[]
    {
        return this._options;
    }

}