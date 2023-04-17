import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Exception_InvalidProgramState, Register, RootCircuit } from "temp-circuits"
import path from "path";


export enum CommonFileName
{
    decovaSettings = "decova-settings.json",
    wvSnippets =  'wv.code-snippets',
    gitIgnore = '$$$gitignore',
    tsConfigJson = 'tsconfig.json',
    launch = "launch.json",
    tasksJson = "tasks.json",
    settings = "settings.json",
    packgeJson = "package.json",
    WalkthroughsSheet = "walkthroughs_sheet.json",
    WalkthroughsSchema = "walkthroughs_schema.json"
}


export enum CommonDirName
{
    vscode = ".vscode",
    // gotcha_main_dir = "decova-gotcha-data",
    // decova_gotcha_repo = "decova-gotcha-data",
    // text_snippets = "text-snippets"
    Template_RootDir_AnyNodeProject = 'AnyNodeJSProject',
    Template_RootDir_NewNodeProject = 'NewNodeJSProject',
}

export const TEMPLATE_PLACEHOLDER = '___TEMPLATE_PLACEHOLDER___';

@Register()
export class UPathMan extends RootCircuit
{
    private _UserProfileDir!: DirectoryInfo;
    get UserProfileDir(): DirectoryInfo
    {
        if(this._UserProfileDir) return this._UserProfileDir

        if(!process.env.USERPROFILE)
        {
            throw new Exception_InvalidProgramState("process.env.USERPROFILE", "process.env.USERPROFILE is empty or undefined");
        }

        this._UserProfileDir = new DirectoryInfo(process.env.USERPROFILE!);
        return this._UserProfileDir;
    }

    get mindMapsDir(): DirectoryInfo
    {
        return new DirectoryInfo("G:/MyMindMaps");
    };



    get xmmapTemplateFile(): FileInfo 
    {
        return new FileInfo(Path.join(this.mindMapsDir.FullName, `${TEMPLATE_PLACEHOLDER}.xmmap`));
    }

    getMindMapFile(documentName: string ): FileInfo
    {
        return new FileInfo(Path.join(this.mindMapsDir.FullName, `ggg ${documentName}.xmmap`));
    }

    // private _GotchaMainDir!: DirectoryInfo;
    // get GotchaMainDir(): DirectoryInfo
    // {
    //     if(this._GotchaMainDir) return this._GotchaMainDir;

    //     this._GotchaMainDir = new DirectoryInfo(`${this.UserProfileDir.FullName}\\${CommonDirName.gotcha_main_dir}`);
    //     this._GotchaMainDir.Ensure();
    //     return this._GotchaMainDir;
    // }

    get distDir(): DirectoryInfo
    {
        return new FileInfo(process.argv.xSkip(1).xFirst()).directory;
    }

    get dstVscodeDir(): DirectoryInfo
    {
        return new DirectoryInfo(Path.join(this.currentDir.FullName, CommonDirName.vscode));
    }

    get dstnWvSnippetsFilePath(): string
    {
        return Path.join(this.dstVscodeDir.FullName, CommonFileName.wvSnippets);
    }

    get dstnGitIgnoreFilePath(): string
    {
        return Path.join(this.currentDir.FullName, CommonFileName.gitIgnore);
    }

    get dstnTsConfigFilePath(): string
    {
        return Path.join(this.currentDir.FullName, CommonFileName.tsConfigJson);
    }

    get mode(): 'dev' | 'prod'
    {
        return (this.distDir.Name === 'wv-gotcha')? 'prod' : 'dev';
    }

    get mainDeploymentDir(): DirectoryInfo
    {
        if(this.mode === 'prod') return this.distDir;
        else return this.distDir.Parent!;
    }

    get contentDir(): DirectoryInfo
    {
        return new DirectoryInfo(path.join(this.mainDeploymentDir.FullName, 'content'));
    }

    get codeTemplatesDir(): DirectoryInfo
    {
        return new DirectoryInfo(path.join(this.contentDir.FullName, `CodeTemplates`));
    }



    get templateRootDir_AnyNodeJSProject(): DirectoryInfo
    {
        CommonDirName
        return new DirectoryInfo(path.join(this.contentDir.FullName, `AnyNodeJSProject`));
    }

    // static get GotchaLocalDataDir(): DirectoryInfo
    // {
    //     const path = Path.Join(this.GotchaMainDir.FullName);
    //     const rootDataDir = new DirectoryInfo(path);
    //     rootDataDir.Ensure();

    //     return rootDataDir;
    // }

    // static get GotchaLocalRepoGitDir(): DirectoryInfo
    // {
    //     const path = Path.Join(this.GotchaLocalDataDir.FullName, ".git");
    //     return new DirectoryInfo(path);
    // }

    // get GotchaLocalRepo_Vscode_Dir(): DirectoryInfo
    // {
    //     const path = Path.join(this.GotchaMainDir.FullName, CommonDirName.vscode)
    //     return new DirectoryInfo(path)
    // }

    // get GotchaLocalRepo_WalkthroughsSheet(): FileInfo
    // {
        
    //     const path = Path.join(this.GotchaMainDir.FullName, CommonFileName.WalkthroughsSheet);
    //     return new FileInfo(path);
    // }

    // static get GotchaLocalRepo_WalkthroughsSchema(): FileInfo
    // {
    //     const path = Path.Join(this.GotchaLocalRepo.FullName, CommonFileName.WalkthroughsSchema);
    //     return new FileInfo(path);
    // }

    // get GotchaLocalRepo_DecovaSettingsFile(): FileInfo
    // {
    //     const path = Path.join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.decovaSettings);
    //     return new FileInfo(path);
    // }

    // get GotchaLocalRepo_DecovaSnippets(): FileInfo
    // {
    //     const path = Path.join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.decovaSnippets);
    //     return new FileInfo(path);
    // }

    
    // get GotchaLocalRepo_LaunchFile(): FileInfo
    // {
    //     const path = Path.join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.launch);
    //     return new FileInfo(path);
    // }

    // get GotchaLocalRepo_SettingsFile(): FileInfo
    // {
    //     const path = Path.join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonFileName.settings);
    //     return new FileInfo(path);
    // }


    get currentDir(): DirectoryInfo
    {
        if(this.distDir.Name === 'dist') return new DirectoryInfo(`J:/Test_wV_Gotcha_output`);
        else return DirectoryInfo.Current;
    }


    get CurrentWorkspace_VsCodeDir(): DirectoryInfo
    {
        const path = Path.join(this.currentDir.FullName, CommonDirName.vscode)
        return new DirectoryInfo(path);
    }

    get CurrentWorkspace_DecovaSettings(): FileInfo
    {
        const path = Path.join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSettings)
        return new FileInfo(path);
    }

    get CurrentWorkspace_Settings(): FileInfo
    {
        const path = Path.join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.settings)
        return new FileInfo(path);
    }

    get CurrentWorkspace_Tasks(): FileInfo
    {
        const path = Path.join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.tasksJson)
        return new FileInfo(path);
    }

    // get CurrentWorkspace_DecovaSnippets(): FileInfo
    // {
    //     const path = Path.join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.decovaSnippets)
    //     return new FileInfo(path);
    // }

    get CurrentWorkspace_Lanuch(): FileInfo
    {
        const path = Path.join(this.CurrentWorkspace_VsCodeDir.FullName, CommonFileName.launch)
        return new FileInfo(path);
    }

    // get GotchaLocalRepo_TextSnippets_Dir(): DirectoryInfo
    // {
    //     const path = Path.join(this.GotchaLocalRepo_Vscode_Dir.FullName, CommonDirName.text_snippets)
    //     return new DirectoryInfo(path);
    // }

    get CurrentWorkspace_PackageJson(): FileInfo
    {
        const path = Path.join(this.currentDir.FullName, CommonFileName.packgeJson)
        return new FileInfo(path);
    }

}