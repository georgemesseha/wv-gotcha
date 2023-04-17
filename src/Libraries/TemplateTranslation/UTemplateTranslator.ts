import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { RootCircuit } from "temp-circuits";
import { Circuit } from "temp-circuits";
import { Register } from "temp-circuits/dist/Decorators/_Register";
import { Dialog } from "../../Dialog";
import { UPathMan } from "../../UPathMan";
import { UTextTranslator } from "./UTextTranslator";

@Register()
export class UTemplateTranslator extends RootCircuit
{
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