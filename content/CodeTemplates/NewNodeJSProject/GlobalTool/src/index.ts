import chalk from "chalk";
import { DirectoryInfo } from "decova-filesystem";
import figlet from "figlet";
import 'decova-dotnet'
import { Mcq_YesNo } from "./Mcq_YesNo";

const pjson = require('../package.json');

function showStartupInfo()
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

showStartupInfo();
new Mcq_YesNo().selectAsync('This is a sample yes or no question');