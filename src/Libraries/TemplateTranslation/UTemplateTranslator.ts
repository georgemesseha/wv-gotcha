import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { Regex, RootCircuit } from "temp-circuits";
import { Circuit } from "temp-circuits";
import { Register } from "temp-circuits/dist/Decorators/_Register";
import { Dialog } from "../../Dialog";
import { UPathMan } from "../../UPathMan";
import { UTextTranslator } from "./UTextTranslator";
import { cwd } from "process";
import { Path } from "wv-filesystem";

@Register()
export class UTemplateTranslator extends RootCircuit
{
    async translateGenericTemplateFileAsync(templateDirName: string,
                                srcFileRelPath: string, 
                                translationDictionary: {from: string, to: string}[], 
                                overwrite = false): Promise<boolean>
    {
        await this._ensurePlaceholderValuesAsync(srcFileRelPath, translationDictionary);
        let absRootSrcDir = path.join(UPathMan.$().genericGenDirTemplates.FullName, 
                                      templateDirName)
                                .xReplaceAll('\\', '/');


        const srcAbsFilePath = Path.join(absRootSrcDir, srcFileRelPath).xReplaceAll("\\", "/");
        
        const dstRootDir = UPathMan.$().currentDir.FullName;
        const dstFileRelPath = UTextTranslator.$().translateGenericTemplateFile(srcFileRelPath, translationDictionary);
        const dstAbsFilePath = Path.join(dstRootDir, dstFileRelPath).xReplaceAll('\\', '/');

        if(!overwrite && new FileInfo(dstAbsFilePath).exists())
        {
            Dialog.warning(`Already existing file skipped: ${dstAbsFilePath}`);  
            return false;
        } 

        Dialog.info(`Creating file: ${dstAbsFilePath}`)
        const contentToTranslate = new FileInfo(srcAbsFilePath).readAllText();
        await this._ensurePlaceholderValuesAsync(contentToTranslate, translationDictionary);


        const translatedContent = UTextTranslator.$().translateGenericTemplateFile(contentToTranslate, translationDictionary);
        const newFile = new FileInfo(dstAbsFilePath);
        newFile.directory.Ensure();
        newFile.writeAllText(translatedContent);
        return true;
    }

    private async _ensurePlaceholderValuesAsync(text: string, translationDictionary: {from: string, to: string}[])
    {
        const placehoderMatches = Regex.of(/___[0-9A-z\$_]+/g).getMatches(text);
        for(let placeholderMatch of placehoderMatches)
        {
            const existing = translationDictionary.xFirstOrDefault(i => i.from === placeholderMatch.value);
            if(!existing)
            {
                const value = await Dialog.askForTextAsync(placeholderMatch.value);
                translationDictionary.xAdd({from: placeholderMatch.value, to: value});
            }
        }
    }

    translate(srcRootDirPath: string, 
              toTranslateFileSelector: (absPath: string)=>boolean,
              translationMap: Map<string, string> = new Map(),
              overwrite = false): number
    {
        let absRootSrcDir = path.join(UPathMan.$().codeTemplatesDir.FullName, 
                                      srcRootDirPath)
                                .xReplaceAll('\\', '/');

        const filesToTranslate = 
        new DirectoryInfo(absRootSrcDir)
            .GetDescendantFiles()
            .xSelect(f => f.fullName)
            .xWhere(f => toTranslateFileSelector(f))
            .xSelect(f => f.xReplaceAll('\\', '/'));

        let count = 0;
        for(let fPath of filesToTranslate)
        {
            const fSrcRelPath = fPath.xReplaceFirstOccurence(absRootSrcDir, '');
            let fDstAbsPath = path.join(UPathMan.$().currentDir.FullName, fSrcRelPath);
            fDstAbsPath = fDstAbsPath.xReplaceAll('$$$', '.');

            fDstAbsPath = UTextTranslator.$().translate(fDstAbsPath, translationMap);

            
            if(!overwrite && new FileInfo(fDstAbsPath).exists())
            {
                Dialog.warning(`File skipped: ${fDstAbsPath}`);  
                continue;
            } 

            Dialog.info(`Creating file: ${fDstAbsPath}`)
            const contentToTranslate = new FileInfo(fPath).readAllText();
            const translatedContent = UTextTranslator.$().translate(contentToTranslate, translationMap);
            const newFile = new FileInfo(fDstAbsPath);
            newFile.directory.Ensure();
            newFile.writeAllText(translatedContent);

            count ++;
        }

        return count;
    }
}