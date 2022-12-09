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
export class WTR_Dev_Generatate_AnyNodeJSProject_GitIgnore implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Generate >> /.gitignore';

    async execAsync()
    {
        const pathMan = UPathMan.resolve();

        if(new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.gitIgnore} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.gitIgnore.toLowerCase();
        }

        const count = UTemplateTranslator.resolve().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} File ${CommonFileName.gitIgnore} has been created.`);
        }
    }
}