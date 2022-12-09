import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Ops_ListGlobalyInstalledPackages implements IWalkthrough
{
    text = `Ops >> NodeJS >> List globally installed packages`; 
    async execAsync()
    {
        await Dialog.exec('npm list --global --depth=0');
    }
}