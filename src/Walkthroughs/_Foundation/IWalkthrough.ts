
export interface IWalkthrough
{
    text: string;

    execAsync(): Promise<void>;
}