import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { Mcq_CircuitsTasks } from "../Mcq_CircuitsTasks";
import { TEMPLATE_PLACEHOLDER, UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";
import { DirectoryInfo } from "wv-filesystem";
import childProcess from 'child_process';
import { cwd } from "process";

@RegisterWalkthrough()
export class WTR_DenoPublish implements IWalkthrough
{
    text = `Deno-Publish`; 
 
    async execAsync()
    {
        const comment = await Dialog.askForTextAsync(`commit comment:`);
        Dialog.hintWillExec('Commiting and pushing your changes? press ENTER to continue');
        await Dialog.promptContinueAsync();
        Dialog.exec(`git add .`);
        Dialog.exec(`git commit -m "${comment}"`);
        Dialog.exec(`git push`);

        Dialog.hintWillExec('Openning releases page:');
        const dirName = UPathMan.$().currentDir.Name; 
        const releaseUrl = `https://github.com/wV-software/${dirName}/releases/`;
        // const releaseUrl = `https://github.com/wV-software/wv_core/releases/`;
        Dialog.exec(`start ${releaseUrl}`);
        await Dialog.instructAsync(`Find "Draft a new realse" button to start`);

    }
}