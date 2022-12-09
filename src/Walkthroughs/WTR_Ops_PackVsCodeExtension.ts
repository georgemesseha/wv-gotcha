import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { PackageJson } from "../Libraries/PackageJson/PackageJson";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { CommonDirName, CommonFileName, UPathMan } from "../UPathMan";
import { UTranslateTemplate } from "../UTranslateTemplate";
import { WTR_Ops_AnyNodeJSProject_IncrementPatch } from "./WTR_Ops_AnyNodeJSProject_IncrementPatch";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Ops_PackVsCodeExtension implements IWalkthrough
{
    text = 'Ops >> Pack your vscode Extension';

    async execAsync()
    {
        const pathMan = UPathMan.resolve();

        await Dialog.exec('tsc');
        await new WTR_Ops_AnyNodeJSProject_IncrementPatch().execAsync();
        await Dialog.exec('vsce package');
    }
}