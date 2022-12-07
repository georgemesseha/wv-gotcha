import chalk from "chalk";
import { DirectoryInfo } from "decova-filesystem";
import figlet from "figlet";
import { UniCircuit } from "./Circuits";
import { Mcq_YesNo } from "./Mcq_YesNo";
import { Q } from "./Q";
const pjson = require('../package.json');

export class UApp extends UniCircuit
{
    private showStartupInfo()
    {
        console.log
            (
                chalk.cyanBright
                    (
                        figlet.textSync("Gtch`", { horizontalLayout: "default" })
                    )
            );
        console.log(pjson.version);
        console.log(`PID: ${process.pid}`)
        console.log('........................................');
        console.log('@' + DirectoryInfo.Current.FullName);
        console.log('........................................');
    }


    override async onInit(): Promise<void>
    {
        this.showStartupInfo();

        // const promptContinue = new UMcq<string>([`1- Yes`, `0- No`], op => op);
        // const answer = await promptContinue.promptAsync('are you sure?') == `1- Yes`;

        const answer = await Q.YesOrNoAsync('Are you sure?');
        Q.pickWalkghrough();
        
    }
}