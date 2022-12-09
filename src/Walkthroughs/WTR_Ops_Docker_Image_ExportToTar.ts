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
export class WTR_Ops_Docker_Image_ExportToTar implements IWalkthrough
{
    text = 'Ops >> Docker >> Image >> Export image to tar file';

    async execAsync()
    {
        await Dialog.exec('docker image ls');
        const imageId = await Dialog.instructAsync('Pick an image Id from the above list');
        const outputFilePath = await Dialog.instructAsync('Output .tar file path?');
        await Dialog.exec(`docker image save ${imageId} ${outputFilePath}`);
    }
}