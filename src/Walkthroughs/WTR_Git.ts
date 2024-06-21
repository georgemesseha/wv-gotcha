import { Dialog } from "../Dialog";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Git_EditGlobalConfiguration implements IWalkthrough
{
    text = 'Git >> Edit global configuration';
    async execAsync()
    {
        Dialog.exec(`git config --global core.editor "code --wait"`);
        Dialog.exec(`git config --global -e`);
    }
}

@RegisterWalkthrough()
export class WTR_Git_ListBranches implements IWalkthrough
{
    text = 'Git >> List branches';
    async execAsync()
    {
        Dialog.exec(`git branch`);
    }
}


