import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { TEMPLATE_PLACEHOLDER, UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Notes_NewMinMap implements IWalkthrough
{
    text = `Notes >> New mindmap (.xmmap)`; 
 
    async execAsync()
    {
        const pathMan = UPathMan.resolve();

        let docName!: string;
        while(true)
        {
            docName = await Dialog.askForTextAsync('Document Name?');
            const isValid = /^[0-9A-z \-\._\(\)]+$/.test(docName);
            if (!isValid)
            {
                Dialog.error("File name is expected to contains alphabets, numerics and {-,.,_,(,)} only");
                continue;
            }

            break;
        }
        
        var newFile = pathMan.getMindMapFile(docName);
        if(newFile.exists() === false)
        {
            const templateFile = new FileInfo(pathMan.xmmapTemplateFile.fullName);
            const content = templateFile.readAllText().xReplaceAll(TEMPLATE_PLACEHOLDER, docName);
            pathMan.getMindMapFile(docName).writeAllText(content);
        }

        Dialog.info(`Pleae wait for ${docName}.xmmap to open`);
        Dialog.exec(`\"${newFile.fullName}\"`);
    }
}