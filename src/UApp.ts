import chalk from "chalk";
import figlet from "figlet";
import { Register, RootCircuit } from "temp-circuits";
import { Shell } from "./Shell";
import { UPathMan } from "./UPathMan";
const pjson = require('../package.json');

@Register()
export class UApp extends RootCircuit
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
        console.log('@' + UPathMan.$().currentDir.FullName);
        console.log('........................................');
    }


    override async onInit(): Promise<void>
    {
        this.showStartupInfo();

        // const promptContinue = new UMcq<string>([`1- Yes`, `0- No`], op => op);
        // const answer = await promptContinue.promptAsync('are you sure?') == `1- Yes`;

        Shell.pickWalkghrough();
        
    }
}