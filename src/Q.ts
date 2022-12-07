import { Mcq_Walkthroughs } from "./Mcq_Walkthroughs";
import { Mcq_YesNo } from "./Mcq_YesNo";

export class Q
{
    static async YesOrNoAsync(question: string): Promise<boolean>
    {
        return await new Mcq_YesNo().selectAsync(question);
    }

    static async pickWalkghrough()
    {
        const walkthrough = await new Mcq_Walkthroughs().selectAsync(`Pick a walkthrough:`);
        await walkthrough.execAsync();
    }
}