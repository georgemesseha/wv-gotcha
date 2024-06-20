import { Background, Foreground } from "decova-terminal";
import { Mcq_Walkthroughs } from "./Mcq_Walkthroughs";
import { Mcq_YesNo } from "./Mcq_YesNo";
import ch from "chalk";
import inquirer from "inquirer";
import * as cp from "child_process";
import { Command } from "commander";
import { UPathMan } from "./UPathMan";

export class Dialog
{
    static async yesOrNoAsync(question: string): Promise<boolean>
    {
        return await new Mcq_YesNo().selectAsync(question);
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

    static exec(cmd:string, currentDir: string|null = null):void
    {
        console.log
        (
            ch.bgBlack.blackBright(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        );
        console.log
        (
            ch.green.bold(`>> ${cmd}`)
        );


            const program = new Command();
            cp.exec(cmd, (error, stdout, stderr) => {
                console.log(stdout)
                if (error) {
                  console.error(`Error executing command: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  throw `Execution terminated due to the logged error`;
                }
                console.log(`stdout: ${stdout}`);
              });
            // cp.execSync(cmd, [], {cwd: currentDir ?? UPathMan.$().currentDir.FullName, 
            //                        stdio:'inherit', shell:"cmd.exe"});

        console.log
        (
            ch.bgBlack.blackBright("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        );
    }

    static async instructAsync(instruction: string, ackMessage: string|null = null)
    {
        console.log(ch.yellowBright.bold(`♣ ${instruction}`));
        if(ackMessage !== null)
        {
            await inquirer.prompt([{name:"foo", message:ackMessage}]);
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

    static info(info: string)
    {
        console.log(ch.bgYellowBright.green(` i: ${info} `));
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

    static async askForTextAsync(question: string)
    {
        // this._showQuestion(question);
        let x = await inquirer.prompt([{name:"foo", message:question}]).then();
        return x.foo;
    }

    static async openExplorerAsync(dirPath: string)
    {
        this.exec(`explorer \"${dirPath}\"`);
    }

    static hintWillExec(hint: string)
    {
        console.log(ch.bgYellow.black(`>>> ${hint}`));
        // let x = await inquirer.prompt([{name:"foo", message:ch.bgYellow.black(`>>> ${hint}`)}]).then();
        // return x.foo;
    }

    static async promptContinueAsync()
    {
        await inquirer.prompt([{name:"foo", message:ch.bgMagenta.white(`>>> Press "ENTER" to continue`)}]).then();
    }
}