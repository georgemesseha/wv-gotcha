import { Regex } from "temp-circuits";
import { Shell } from "../../Shell";

export class Git
{

    static async getRemoteOriginAsync(): Promise<string>
    {
        const result = await Shell.RunForStdout("git remote -v");
        const matches = Regex.of(/\s/g).splitByMatches(result);
        if(matches.length < 2)
        {
            Shell.error("No remote configuration found");
            process.exit(0);   
        }

        return matches[1].value;
    } 

    static getBranchNames()
    {
        const result = Shell.RunForStdout("git branch");
        const names = Regex.of(/\n/g).splitByMatches(result).map(b=>b.value).filter(name => !!name).map(name => name.replace("*", "").trim().toLowerCase());

        return names;
    }

    static getCurrentBranch(): string
    {
        const currentBranch = Shell.RunForStdout("git symbolic-ref --short HEAD").trim();
        return currentBranch;
    }
}