import { CurrentTerminal as Terminal } from "decova-terminal";
import * as inquirer from "inquirer"

type DlgTextRepresenter<TOption> = (option:TOption)=>string


export abstract class Mcq<TOption>
{
    // private _plainOptions: string[] = [];

    // constructor(private _displaySelector:DlgTextRepresenter<TOption>)
    // {
    //     // this._plainOptions = this._options.xSelect(op => this._displaySelector(op as TOption)).xWhere(display => !!display);
    // }

    private get _plainOptions()
    {
        return this.options.xSelect(op => this._deduceOptionText(op as TOption)).xWhere(display => !!display);
    }

    protected abstract get _deduceOptionText(): DlgTextRepresenter<TOption>;

    protected abstract options: TOption[]

    private _filterOptions(options:string[], searchString: string): string[]
    {
        if(!searchString) return options;
        const keys = searchString.split(" ").xSelect(s => s.trim().toLowerCase())
        const output = options.xWhere(op => keys.xAll(k => op.toLowerCase().indexOf(k) >= 0));
        return output;
    }

    private async _promptPlainAsync(prompt: string): Promise<string>
    {
        inquirer.registerPrompt
        (
            'autocomplete',
            require('inquirer-autocomplete-prompt')
        );
        
        const answer = await inquirer.prompt
        ([
            {
                type: 'autocomplete',
                name: 'desc',
                pageSize: 20,
                message: prompt,
                source: (answersSoFar:string[], input:string) => 
                {
                    return this._filterOptions(this._plainOptions, input);
                }
            }
        ]);

        return answer['desc'];
    }

    public async selectAsync(prompt: string): Promise<TOption>
    {
        const selectedPlain = await(this._promptPlainAsync(prompt));
        return this.options.xFirst(op => this._deduceOptionText(op) == selectedPlain);
    }
}
