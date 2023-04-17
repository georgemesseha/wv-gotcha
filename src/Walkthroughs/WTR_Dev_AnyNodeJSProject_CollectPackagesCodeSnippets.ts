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
export class WTR_Dev_AnyNodeJSProject_CollectPackagesCodeSnippets implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Collect node_modules Code Snippets';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        const nodeModulesDir = pathMan.currentDir.GetDirectories().xFirstOrNull(d => d.Name === 'node_modules');
        if(!nodeModulesDir)
        {
            Dialog.error(`node_modules file not found @${pathMan.currentDir}`);
            return;
        }

        let count = 0;
        for(let dir of nodeModulesDir.GetDirectories())
        {
            const snippetsFile = new FileInfo(Path.join(dir.FullName, 'package.code-snippets'));
            if(snippetsFile.exists())
            {
                const dstPath = Path.join(pathMan.dstVscodeDir.FullName, `${dir.Name}.code-snippets`)
                Dialog.info(`Creating ${dstPath}`);

                snippetsFile.copyTo(dstPath);

                count ++;
            }
        }

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} .code-snippets file(s) have been created.`);
        }
    }
}