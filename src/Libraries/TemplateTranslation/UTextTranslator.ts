import { ChildCircuit, Register, RootCircuit } from "temp-circuits";

@Register()
export class UTextTranslator extends RootCircuit
{
    translate(sourceText: string, translationMap: Map<string, string>): string
    {
        for(let placeholder of translationMap.xKeys())
        {
            sourceText = sourceText.xReplaceAll(placeholder, translationMap.xGet(placeholder)!);
        }

        return sourceText;
    }

    translateGenericTemplateFile(sourceText: string, translationDictionary: {from: string, to: string}[]): string
    {
        for(let pair of translationDictionary)
        {
            sourceText = sourceText.xReplaceAll(pair.from, pair.to);
        }

        return sourceText;
    }
}