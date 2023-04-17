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
export class WTR_Ops_AnyNodeJSProject_IncrementPatch implements IWalkthrough
{
    text = 'Ops >> Any NodeJS Project >> package.json >> patch ++ (increment)';

    async execAsync()
    {
        const pathMan = UPathMan.$();
        
        const currentDir = pathMan.currentDir.FullName;
        const pkgFile = new FileInfo(Path.join(currentDir, 'package.json'));

        if(pkgFile.exists() == false)
        {
            Dialog.error(`No package.json found @${currentDir}`)
            return;
        }

        Dialog.info(`File updated: ${pkgFile.fullName}`);
        const pkg = new PackageJson(pkgFile.fullName);

        pkg.incrementVersionPatch(true);
        Dialog.success(`Package version updated to ${pkg.version}`);
    }

}