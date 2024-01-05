import { IWalkthrough } from "./Walkthroughs/_Foundation/IWalkthrough";
import { Mcq } from "./Mcq";
import { TranslationMapping, TranslationMap } from "./Libraries/TemplateTranslation/TranslationMap";
import { Dialog } from "./Dialog";


export class Mcq_PickGenTemplate extends Mcq<TranslationMapping>
{
    private _mappings!: TranslationMapping[];

    constructor(private _translationMaps: TranslationMap[])
    {
        super();
        this._mappings = _translationMaps.xSelectMany(map => map.mappings).xSort((m1, m2)=>m1.title > m2.title? 1 : -1);
    }

    protected get _deduceOptionText(): (option: TranslationMapping) => string
    {
        return option => option.title;
    }

    protected get options()
    {
        return this._mappings;
    }

}