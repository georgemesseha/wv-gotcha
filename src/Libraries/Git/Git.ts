import { Regex } from "temp-circuits";
import { Shell } from "../../Shell";

export class Git
{
    static async GetRemoteOriginAsync(): Promise<string>
    {
        const result = await Shell.RunForStdoutAsync("git remote -v");
        const matches = Regex.of(/\s/g).splitByMatches(result);
        if(matches.length < 2)
        {
            Shell.error("No remote configuration found");
            process.exit(0);   
        }

        return matches[1].value;
    } 
}