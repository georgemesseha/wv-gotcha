import { TransientCircuit, UniCircuit } from "../..";

export class UTextTranslator extends UniCircuit
{
    translate(sourceText: string, translationMap: Map<string, string>): string
    {
        for(let placeholder of translationMap.xKeys())
        {
            sourceText = sourceText.xReplaceAll(placeholder, translationMap.xGet(placeholder)!);
        }

        return sourceText;
    }
}