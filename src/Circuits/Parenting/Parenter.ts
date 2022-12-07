import { Exception_InvalidOperation, isPrimitive } from "../_DotNet";

const KEY_Parents = '$$__Parents__$$'

class ParentInfo
{
    constructor(public childNameOnParent: string,
                public parent: any) {}

    static compare(parentInfo1: ParentInfo, parentInfo2: ParentInfo): boolean
    {
        return parentInfo1.childNameOnParent === parentInfo2.childNameOnParent &&
        parentInfo1.parent === parentInfo2.parent;
    }
}

export class Parenter
{
    private constructor(private _obj: any) 
    {

    }

    static of(obj: any)
    {
        return new Parenter(obj);
    }

    private getParentingInfo(): ParentInfo[]
    {
        return this._obj[KEY_Parents];
    }

    private ensureParentingInfo(): ParentInfo[]
    {
        if(!this.getParentingInfo()) this._obj[KEY_Parents] = [];

        return this._obj[KEY_Parents] as [];
    }

    ensureParent(childNameOnParent: string, parent:any)
    {
        const parentInfo = new ParentInfo(childNameOnParent, parent);
        if(isPrimitive(parent)) throw new Exception_InvalidOperation('invalid primitive parent');
        this.ensureParentingInfo().xEnsureItem(parentInfo, ParentInfo.compare);
    }

    removeParentIfAny(childNameOnParent: string, parent:any)
    {
        const parentInfo = new ParentInfo(childNameOnParent, parent);
        if(isPrimitive(parent)) throw new Exception_InvalidOperation('invalid primitive parent');
        const parentingInfo = this.getParentingInfo(); 
        if(!parentingInfo) return;

        parentingInfo.xEnsureItem(parentInfo, ParentInfo.compare);
    }

    getParents(): any[]
    {
        const parentingInfo = this.getParentingInfo();
        if(!parentingInfo) return [];
        
        return parentingInfo.xSelect(p=>p.parent);
    }

    getAncestors(): any[]
    {
        const output = this.getParents();

        while(true)
        {
            const newParents = output.xSelectMany(p => Parenter.of(p).getParentingInfo())
                                     .xSelect(pInfo => pInfo.parent)
                                     .xExcept(output);
            if(newParents.xAny())
            {
                output.xAddRange(newParents);
                continue;
            }
            break;
        }
        
        return output;
    }


}