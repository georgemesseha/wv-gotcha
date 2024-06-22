import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { RootCircuit } from "temp-circuits";
import { Register } from "temp-circuits/dist/Decorators/_Register";
import { Shell } from "../../Shell";
import { CommonFileName, UPathMan } from "../../UPathMan";
import { UTextTranslator } from "./UTextTranslator";
import { Path } from "wv-filesystem";
import { TranslationMap, TranslationMapping } from "./TranslationMap";
import { Mcq_PickGenTemplate } from "../../Mcq_PickGenTemplate";

@Register()
export class UTemplatePicker extends RootCircuit
{
    async promptTranslationMappingPicking(): Promise<TranslationMapping>
    {
        const genericGenMainDir = UPathMan.$().genericGenTemplates;
        const templateDirs = genericGenMainDir.GetDirectories()
                                              .xWhere(d => new FileInfo(Path.join(d.FullName, CommonFileName.translationMap))
                                                            .exists()
                                                     );
        const translationMapFilePaths = templateDirs.xSelect(d=>Path.join(d.FullName, CommonFileName.translationMap));
        function loadTranslationMap(mapFilePath: string): TranslationMap
        {
            const map = require(mapFilePath) as TranslationMap;
            const templateDir = new FileInfo(mapFilePath).directory;
            const templatePath = templateDir.FullName;
            //#region set abs path for translation items
            for(const mapping of map.mappings)
            {
                mapping.templateDirName = templateDir.Name;
                // for(const translationItem of mapping.translationItems)
                // {
                //     translationItem.absPath = Path.join(templatePath, translationItem.relativePath);
                // }
            }
            //#endregion
            return map;
        }
        const translationMaps = translationMapFilePaths.xSelect(path=>loadTranslationMap(path)) as TranslationMap[]; 
        
        const mcq = new Mcq_PickGenTemplate(translationMaps);
        const answer = await mcq.selectAsync('Pick your template:');

        return answer;

        // console.log(JSON.stringify(translationMaps));
        
        // let absRootSrcDir = path.join(UPathMan.$().codeTemplatesDir.FullName, 
        //                               srcRootDirPath)
        //                         .xReplaceAll('\\', '/');

        // const filesToTranslate = 
        // new DirectoryInfo(absRootSrcDir)
        //     .GetDescendantFiles()
        //     .xSelect(f => f.fullName)
        //     .xWhere(f => toTranslateFileSelector(f))
        //     .xSelect(f => f.xReplaceAll('\\', '/'));

        // let count = 0;
        // for(let fPath of filesToTranslate)
        // {
        //     const fSrcRelPath = fPath.xReplaceFirstOccurence(absRootSrcDir, '');
        //     let fDstAbsPath = path.join(UPathMan.$().currentDir.FullName, fSrcRelPath);
        //     fDstAbsPath = fDstAbsPath.xReplaceAll('$$$', '.');

        //     fDstAbsPath = UTextTranslator.$().translate(fDstAbsPath, translationMap);

            
        //     if(!overwrite && new FileInfo(fDstAbsPath).exists())
        //     {
        //         Dialog.warning(`File skipped: ${fDstAbsPath}`);  
        //         continue;
        //     } 

        //     Dialog.info(`Creating file: ${fDstAbsPath}`)
        //     const contentToTranslate = new FileInfo(fPath).readAllText();
        //     const translatedContent = UTextTranslator.$().translate(contentToTranslate, translationMap);
        //     const newFile = new FileInfo(fDstAbsPath);
        //     newFile.directory.Ensure();
        //     newFile.writeAllText(translatedContent);

        //     count ++;
        // }

        // return count;
    }
}