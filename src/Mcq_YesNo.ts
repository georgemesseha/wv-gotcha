import { Mcq } from "./Mcq";



export class Mcq_YesNo extends Mcq<boolean>
{
    protected get _deduceOptionText(): (option: boolean) => string
    {
        return (option: boolean) =>
        {
            return option? "1: Yes" : "0: No";
        }
    }
    protected options = [true, false];
}

export class Mcq_AreYouDeadSure extends Mcq<boolean>
{
    protected get _deduceOptionText(): (option: boolean) => string
    {
        return (option: boolean) =>
        {
            return option? "1: Yes I'm dead sure" : "0: No no no, terminate.";
        }
    }
    protected options = [false, true];
}