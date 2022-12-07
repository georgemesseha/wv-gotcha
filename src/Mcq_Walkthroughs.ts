import { IWalkthrough } from "./Walkthroughs/_Foundation/IWalkthrough";
import { Mcq } from "./Mcq";


export class Mcq_Walkthroughs extends Mcq<IWalkthrough>
{
    static _allWalkthroughs: IWalkthrough[] = [];
    static registerWalkthrough(walkthrough: IWalkthrough)
    {
        this._allWalkthroughs.xAdd(walkthrough);
    }

    protected get _displaySelector(): (option: IWalkthrough) => string
    {
        return option => option.text;
    }

    protected get options()
    {
        return Mcq_Walkthroughs._allWalkthroughs.xSort((w1, w2) => w1.text.localeCompare(w2.text));
    }

}