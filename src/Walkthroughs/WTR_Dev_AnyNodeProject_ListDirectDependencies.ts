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
export class WTR_Dev_AnyNodeProject_ListDirectDependencies implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> List direct dependencies';

    async execAsync()
    {
        await Dialog.exec('npm list --depth=0');
    }
}