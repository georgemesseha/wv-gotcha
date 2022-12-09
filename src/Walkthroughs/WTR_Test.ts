import { FileInfo } from "decova-filesystem";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Test implements IWalkthrough
{
    text = `TESTTTTTTTTTTTT`; 
    async execAsync()
    {
        console.log(UPathMan.resolve().distDir.FullName);
        console.warn('toooooooooooooooooot Wallpapers')

        UTemplateTranslator.resolve().translate(`TestLTools`, f => f.xEndsWith('.ts'), 
        new Map([['LTool', 'SSOSO__']]));
    }
}