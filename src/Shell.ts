import { Background, Foreground } from "decova-terminal";
import { Mcq_Walkthroughs } from "./Mcq_Walkthroughs";
import { Mcq_AreYouDeadSure, Mcq_YesNo } from "./Mcq_YesNo";
import ch from "chalk";
import inquirer from "inquirer";
import * as cp from "child_process";
import { UPathMan } from "./UPathMan";
import * as shell from "shelljs";
import { stderr } from "process";

export class Shell
{
    static async yesOrNoAsync(question: string): Promise<boolean>
    {
        return await new Mcq_YesNo().selectAsync(question);
    }

    static getTimeStamp(): string
    {
        const date = new Date();
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }

    static async pickWalkghrough()
    {
        const walkthrough = await new Mcq_Walkthroughs().selectAsync(`Pick a walkthrough:`);
        await walkthrough.execAsync();
    }

    static log(text: string,
        foreground: Foreground = Foreground.inverse,
        background: Background = Background.bgBlack,
        tabs: number = 0,
        isBold: boolean = false,
        isItalic: boolean = false,
        isStrikedOut: boolean = false,
        isUnderlined: boolean = false,
        isDimmed: boolean = false,
    )
    {
        let custom = (ch as any)[foreground][background];
        if (isBold) custom = custom.bold
        if (isItalic) custom = custom.italic
        if (isStrikedOut) custom = custom.strikethrough
        if (isUnderlined) custom = custom.underline
        if (isDimmed) custom = custom.dim


        for (let x = 0; x++; x < tabs) text = `  ${text}`;
        // text = new XString(text).ReplaceAll("\"", "\\\"").Value;
        console.log(custom(text));
    }

    static printList(header: string, items: string[])
    {
        console.log("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
        console.log(ch.bold.bgGray.white(`${header}`) );
        items.forEach(i => console.log(ch.white(`\t${i}`)));
        console.log("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
    }

    static exec(cmd: string, currentDir: string | null = null): void
    {
        console.log
            (
                ch.bgBlack.blackBright(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            );
        console.log
            (
                ch.green.bold(`>> ${cmd}`)
            );

        const child = cp.spawnSync(cmd, [], { stdio: 'inherit', shell: true });

        console.log
            (
                ch.bgBlack.blackBright("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            );
    }

    static async confirmThenExecAsync(cmd: string, explanation: string)
    {
        Shell.hintWillExec(cmd);
        Shell.info(explanation);

        const confirmed = await Shell.yesOrNoAsync("Continue?");
        if(confirmed)
        {
            Shell.exec(cmd);
        }
        else
        {
            Shell.error("Execution terminated by user!");
            throw "Execution terminated by user!";
        }
    }

    static ShowCompletion()
    {
        console.log(
            ch.greenBright("██████████████████████████████ Completed ██████████████████████████████")
        );
    }

    static async instructAsync(instruction: string, ackMessage: string | null = null)
    {
        console.log(ch.yellowBright.bold(`♣ ${instruction}`));
        if (ackMessage !== null)
        {
            await inquirer.prompt([{ name: "foo", message: ackMessage }]);
        }
    }

    static error(error: string)
    {
        this.log(`! ${error}`, Foreground.redBright,
            Background.bgBlack,
            1,
            true,
            true,
            false,
            true);
    }

    static terminate(error: string)
    {
        Shell.error(error);
        process.exit(0);
    }

    static warning(message: string)
    {
        this.log(`! ${message}`, Foreground.magentaBright,
            Background.bgBlack,
            1,
            true,
            true,
            false,
            true);
    }

    static async assert(message: string)
    {
        console.log(ch.bgRedBright.yellow("You must be dead sure before answering the following:"));
        const dlg = new Mcq_AreYouDeadSure();
        const confirmed = await dlg.selectAsync(message);

        if(!confirmed) this.terminate("The execution terminated by the user!");
    }

    static info(info: string)
    {
        console.log(ch.bgYellowBright.green(` ${info} `));
    }

    static success(message: string)
    {
        console.log(ch.bgGreen.white(` ☺ ${message} `));
    }

    private static _showQuestion(question: string)
    {
        this.log(question, Foreground.magentaBright,
            Background.bgBlack,
            1,
            true,
            true,
            false,
            true);
    }

    static async askForTextAsync(question: string): Promise<string>
    {
        // this._showQuestion(question);
        let x = await inquirer.prompt([{ name: "foo", message: question }]).then();
        return x.foo as string;
    }

    static async openExplorerAsync(dirPath: string)
    {
        this.exec(`explorer \"${dirPath}\"`);
    }

    static hintWillExec(hint: string)
    {
        console.log(ch.bgRgb(110, 0, 0).white(`>>> ${hint}`));
        // let x = await inquirer.prompt([{name:"foo", message:ch.bgYellow.black(`>>> ${hint}`)}]).then();
        // return x.foo;
    }

    static async promptContinueAsync()
    {
        await inquirer.prompt([{ name: "foo", message: ch.bgMagenta.white(`>>> Press "ENTER" to continue`) }]).then();
    }

    static RunForStdout(cmd: string): string
    {
        let output = cp.execSync(cmd).toString();
        return output;
    }

    static openInBrowser(url: string) {
        // Define the command based on the operating system
        let command;
        switch (process.platform) {
            case 'darwin': // macOS
                command = `open ${url}`;
                break;
            case 'win32': // Windows
                command = `start "" "${url}"`;
                break;
            case 'linux': // Linux
                command = `xdg-open ${url}`;
                break;
            default:
                console.error('Unsupported platform:', process.platform);
                return;
        }
    
        // Execute the command to open the URL
        cp.execSync(command);
    }
    
}