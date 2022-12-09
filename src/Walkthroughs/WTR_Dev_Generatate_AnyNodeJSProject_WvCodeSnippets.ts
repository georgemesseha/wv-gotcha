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
export class WTR_Dev_Generatate_AnyNodeJSProject_WvCodeSnippets implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Generate >> /.vscode/wv.code-snippets';

    async execAsync()
    {
        const pathMan = UPathMan.resolve();

        if(new FileInfo(pathMan.dstnWvSnippetsFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.wvSnippets} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.wvSnippets.toLowerCase();
        }

        const count = UTemplateTranslator.resolve().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        Dialog.success(`{${count}} File ${CommonFileName.wvSnippets} has been created.`);
    }
}