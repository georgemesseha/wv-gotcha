import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { Circuit, Terminal, UniCircuit } from "../..";
import { Dialog } from "../../Dialog";
import { UPathMan } from "../../UPathMan";
import { UTextTranslator } from "./UTextTranslator";

export class UTemplateTranslator extends UniCircuit
{
    @Circuit(()=>UPathMan)
    private u_PathMan!: UPathMan;

    @Circuit(()=>UTextTranslator)
    private u_TextTranslator!: UTextTranslator;

    translate(srcRootDirPath: string, 
              toTranslateFileSelector: (absPath: string)=>boolean,
              translationMap: Map<string, string> = new Map()): number
    {
        let absRootSrcDir = path.join(this.u_PathMan.codeTemplatesDir.FullName, 
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
            let fDstAbsPath = path.join(this.u_PathMan.currentDir.FullName, fSrcRelPath);
            fDstAbsPath = fDstAbsPath.xReplaceAll('$$$', '.');

            fDstAbsPath = this.u_TextTranslator.translate(fDstAbsPath, translationMap);

            
            if(new FileInfo(fDstAbsPath).exists())
            {
                Dialog.warning(`File skipped: ${fDstAbsPath}`);  
                continue;
            } 

            Dialog.info(`Creating file: ${fDstAbsPath}`)
            const contentToTranslate = new FileInfo(fPath).readAllText();
            const translatedContent = this.u_TextTranslator.translate(contentToTranslate, translationMap);
            const newFile = new FileInfo(fDstAbsPath);
            newFile.directory.Ensure();
            newFile.writeAllText(translatedContent);

            count ++;
        }

        return count;
    }
}