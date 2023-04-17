import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Dev_ViewCurrentlyFocusedProjects implements IWalkthrough
{
    text = `Dev >> View currently focused projects`; 
    async execAsync()
    {
        const path = `G:\\_MyProjects\\__CurrentProjects`
        Dialog.info(`Pleae wait for {${path}} to open`);
        Dialog.exec(`explorer \"${path}\"`);
    }
}