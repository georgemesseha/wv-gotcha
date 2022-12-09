import { Background, Foreground } from "decova-terminal";
import { Mcq_YesNo } from "./Mcq_YesNo";
import ch from "chalk";
import inquirer from "inquirer";

export class Dialog
{
    static async yesOrNoAsync(question: string): Promise<boolean>
    {
        return await new Mcq_YesNo().selectAsync(question);
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
        console.log(ch.bgYellowBright.green(` i: ${info}`));
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
        this._showQuestion(question);
        let x = await inquirer.prompt([{name:"foo", message:question}]).then();
        return x.foo;
    }

    static async hintWillExec(hint: string)
    {
        let x = await inquirer.prompt([{name:"foo", message:ch.bgYellow.black(`>>> ${hint}`)}]).then();
        return x.foo;
    }
}