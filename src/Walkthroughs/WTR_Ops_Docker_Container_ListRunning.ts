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
export class WTR_Ops_Docker_Container_ListRunning implements IWalkthrough
{
    text = 'Ops >> Docker >> Container >> List running containers';

    async execAsync()
    {
        await Dialog.exec('docker ps');
    }
}