import { Mcq } from "./Mcq";



export class Mcq_YesNo extends Mcq<boolean>
{
    protected get _displaySelector(): (option: boolean) => string
    {
        return (option: boolean) =>
        {
            return option? "1: Yes" : "0: No";
        }
    }
    protected options = [true, false];
}