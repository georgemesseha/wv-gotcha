import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { PackageJson } from "../Libraries/PackageJson/PackageJson";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { CommonDirName, CommonFileName, UPathMan } from "../UPathMan";
import { UTranslateTemplate } from "../UTranslateTemplate";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";
import { UTemplatePicker } from "../Libraries/TemplateTranslation/UTemplatePicker";
import { cwd } from "process";
import { Regex } from "temp-circuits";

@RegisterWalkthrough()
export class WTR_GenericGen implements IWalkthrough
{
    text = 'Dev >> Generate ...';

    async execAsync()
    {
        // #region prompt user for his target template mapping
        const templatePicker = UTemplatePicker.$();
        const translationMapping = await templatePicker.promptTranslationMappingPicking();
        // #endregion
        
        const templateDirName = translationMapping.templateDirName;
        let count = 0;

        async function translateFileAsync(srcFileRelPath: string): Promise<boolean>
        {
            for(const pattern of translationMapping.fileRelPathPatternsToIgnore ?? [])
            {
                try
                {
                    if(Regex.parse(pattern).hasMatches(srcFileRelPath))
                    {
                        Dialog.warning(`File '${srcFileRelPath}' skipped by 'fileRelPathPatternsToIgnore = '${pattern}'`);
                        return false;
                    }
                }
                catch(exp)
                {
                    Dialog.error(`fileRelPathPatternsToIgnore = '${pattern}' is not a valid Regex pattern.`);
                    return false;
                }
            }
            
            const isTranslated = await UTemplateTranslator.$().translateGenericTemplateFileAsync(templateDirName, srcFileRelPath, []);
            return isTranslated;
        }
        
        for(let translationItem of translationMapping.translationItems)
        {
            switch(translationItem.itemType)
            {
                case "file":
                    const srcFileRelPath = translationItem.relativePath;
                    const isTranslated = await translateFileAsync(srcFileRelPath);
                    if(isTranslated) count ++;
                    break;
                case "folder":
                    const folder = new DirectoryInfo(Path.join(UPathMan.$().contentDir.FullName));
                    if(folder.Exists() === false) 
                    {
                        Dialog.error(`Folder '${translationItem.relativePath}' doesn't exist!`)
                        continue;
                    }
                    break;
            }
        }

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            if(count > 1)
            {
                Dialog.success(`{${count}} Files have been created.`);
            }
            else
            {
                Dialog.success(`1 File has been created.`);
            }
        }


        // const pathMan = UPathMan.$();

        // if(new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        // {
        //     Dialog.warning(`${CommonFileName.gitIgnore} already exists`);
        //     return;
        // }
    }
}