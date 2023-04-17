import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { PackageJson } from "../Libraries/PackageJson/PackageJson";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { CommonDirName, CommonFileName, UPathMan } from "../UPathMan";
import { UTranslateTemplate } from "../UTranslateTemplate";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Dev_Generatate_AnyNodeJSProject_tsConfigJson implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Generate >> /tsconfig.json';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(new FileInfo(pathMan.dstnTsConfigFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.tsConfigJson} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.tsConfigJson.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} File ${CommonFileName.tsConfigJson} has been created.`);
        }
    }
}