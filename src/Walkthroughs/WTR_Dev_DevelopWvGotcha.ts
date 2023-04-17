import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Dev_DevelopWvGotcha implements IWalkthrough
{
    text = `Dev >> Develop wV Gotcha`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/wv-gotcha`
        Dialog.info(`Pleae wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}