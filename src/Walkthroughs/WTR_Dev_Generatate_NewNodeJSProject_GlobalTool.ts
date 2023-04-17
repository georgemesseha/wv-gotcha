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
export class WTR_Dev_Generatate_NewNodeJSProject_GlobalTool implements IWalkthrough
{
    text = 'Dev >> New NodeJS Project >> Generate >> New Global Tool';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(pathMan.currentDir.GetDirectories().xAny() || pathMan.currentDir.GetFiles().xAny())
        {
            Dialog.error(`Current directory is not empty!`);
            return;
        }


        const ___PACKAGE_NAME = await Dialog.askForTextAsync('Package name?');

        const srcDir = Path.join(CommonDirName.Template_RootDir_NewNodeProject, 'GlobalTool');
        const count = UTemplateTranslator.$().translate(srcDir, ()=>true, new Map([['___PACKAGE_NAME', ___PACKAGE_NAME]]));

        Dialog.exec('npm install');

        Dialog.success(`{${count}} files has been created.`);
    }
}