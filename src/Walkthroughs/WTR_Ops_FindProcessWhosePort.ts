import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Dialog } from "../Dialog";
import { PackageJson } from "../Libraries/PackageJson/PackageJson";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { CommonDirName, CommonFileName, UPathMan } from "../UPathMan";
import { UTranslateTemplate } from "../UTranslateTemplate";
import { WTR_Ops_AnyNodeJSProject_IncrementPatch } from "./WTR_Ops_AnyNodeJSProject_IncrementPatch";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";

@RegisterWalkthrough()
export class WTR_Ops_FindProcessWhosePort implements IWalkthrough
{
    text = 'Ops >> Find process whose port ...';

    async execAsync()
    {
        const port = await Dialog.askForTextAsync('Port?')
        Dialog.exec(`netstat -ano | findstr :${port}`);

        Dialog.instructAsync(`Pick a PID from the above list`);
        const pid = await Dialog.askForTextAsync('PID?');
        Dialog.exec(`tasklist /svc /FI \"PID eq ${pid}\"`);
    }
}