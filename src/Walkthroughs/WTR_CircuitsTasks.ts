import { FileInfo } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { Mcq_CircuitsTasks } from "../Mcq_CircuitsTasks";
import { TEMPLATE_PLACEHOLDER, UPathMan } from "../UPathMan";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_CircuitsTasks implements IWalkthrough
{
    text = `Circuits`; 
 
    async execAsync()
    {
        while(true)
        {
            const task = await new Mcq_CircuitsTasks().selectAsync('Pick a task');
            await task.execAsync();
        }
    }
}