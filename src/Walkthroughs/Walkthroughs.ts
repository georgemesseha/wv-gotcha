import { Dialog } from "../Dialog";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";
import { TEMPLATE_PLACEHOLDER, UPathMan, CommonDirName, CommonFileName } from "../UPathMan";
import { UTemplatePicker } from "../Libraries/TemplateTranslation/UTemplatePicker";
import { Regex } from "temp-circuits";
import { UTemplateTranslator } from "../Libraries/TemplateTranslation/UTemplateTranslator";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Mcq_CircuitsTasks } from "../Mcq_CircuitsTasks";
import { PackageJson } from "../Libraries/PackageJson/PackageJson";
import { DirectoryInfo as wvDirectoryInfo, FileInfo as wvFileInfo, Path as wvPath } from "wv-filesystem";
import { cwd } from "process";
    
const fs = require('fs');
const os = require('os');
const path = require('path');



// #region deno
@RegisterWalkthrough()
export class WTR_DenoPublish implements IWalkthrough
{
    text = `Deno-Publish`; 
 
    async execAsync()
    {
        const comment = await Dialog.askForTextAsync(`commit comment:`);
        Dialog.hintWillExec('Commiting and pushing your changes? press ENTER to continue');
        await Dialog.promptContinueAsync();
        Dialog.exec(`git add .`);
        Dialog.exec(`git commit -m "${comment}"`);
        Dialog.exec(`git push`);

        Dialog.hintWillExec('Openning releases page:');
        const dirName = UPathMan.$().currentDir.Name; 
        const releaseUrl = `https://github.com/wV-software/${dirName}/releases/`;
        // const releaseUrl = `https://github.com/wV-software/wv_core/releases/`;
        Dialog.exec(`start ${releaseUrl}`);
        await Dialog.instructAsync(`Find "Draft a new realse" button to start`);

    }
}
// #endregion

// #region Git >> Edit global configuration
@RegisterWalkthrough()
export class WTR_Git_EditGlobalConfiguration implements IWalkthrough
{
    text = 'Git >> Edit global configuration';
    async execAsync()
    {
        Dialog.exec(`git config --global core.editor "code --wait"`);
        Dialog.exec(`git config --global -e`);
    }
}
// #endregion

// #region Git >> List branches
@RegisterWalkthrough()
export class WTR_Git_ListBranches implements IWalkthrough
{
    text = 'Git >> List branches';
    async execAsync()
    {
        Dialog.exec(`git branch`);
    }
}
// #endregion

// #region Dev >> Generate ...
@RegisterWalkthrough()
export class WTR_GenericGen implements IWalkthrough
{
    text = 'Dev >> Generate ...';

    async execAsync()
    {
        // #region prompt user for his target template mapping
        const templatePicker = UTemplatePicker.$();
        const translationMapping = await templatePicker.promptTranslationMappingPicking();
        // #endregion
        
        const templateDirName = translationMapping.templateDirName;
        let count = 0;

        async function translateFileAsync(srcFileRelPath: string): Promise<boolean>
        {
            for(const pattern of translationMapping.fileRelPathPatternsToIgnore ?? [])
            {
                try
                {
                    if(Regex.parse(pattern).hasMatches(srcFileRelPath))
                    {
                        Dialog.warning(`File '${srcFileRelPath}' skipped by 'fileRelPathPatternsToIgnore = '${pattern}'`);
                        return false;
                    }
                }
                catch(exp)
                {
                    Dialog.error(`fileRelPathPatternsToIgnore = '${pattern}' is not a valid Regex pattern.`);
                    return false;
                }
            }
            
            const isTranslated = await UTemplateTranslator.$().translateGenericTemplateFileAsync(templateDirName, srcFileRelPath, []);
            return isTranslated;
        }
        
        for(let translationItem of translationMapping.translationItems)
        {
            switch(translationItem.itemType)
            {
                case "file":
                    const srcFileRelPath = translationItem.relativePath;
                    const isTranslated = await translateFileAsync(srcFileRelPath);
                    if(isTranslated) count ++;
                    break;
                case "folder":
                    const folder = new DirectoryInfo(Path.join(UPathMan.$().contentDir.FullName));
                    if(folder.Exists() === false) 
                    {
                        Dialog.error(`Folder '${translationItem.relativePath}' doesn't exist!`)
                        continue;
                    }
                    break;
            }
        }

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            if(count > 1)
            {
                Dialog.success(`{${count}} Files have been created.`);
            }
            else
            {
                Dialog.success(`1 File has been created.`);
            }
        }


        // const pathMan = UPathMan.$();

        // if(new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        // {
        //     Dialog.warning(`${CommonFileName.gitIgnore} already exists`);
        //     return;
        // }
    }
}
// #endregion

// #region Dev >> Any .net Project >> Generate >> /.gitignore
@RegisterWalkthrough()
export class WTR_Dev_Generatate_AnyDotNetProject_GitIgnore implements IWalkthrough
{
    text = 'Dev >> Any .net Project >> Generate >> /.gitignore';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.gitIgnore} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.gitIgnore.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyDotNetProject, fileSelector);

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} File ${CommonFileName.gitIgnore} has been created.`);
        }
    }
}
// #endregion

// #region Circuits
@RegisterWalkthrough()
export class WTR_CircuitsTasks implements IWalkthrough
{
    text = `Circuits`; 
 
    async execAsync()
    {
        while(true)
        {
            const task = await new Mcq_CircuitsTasks().selectAsync('Pick a task');
            await task.execAsync();
        }
    }
}
// #endregion

// #region Dev >> Any NodeJS Project >> Collect node_modules Code Snippets
@RegisterWalkthrough()
export class WTR_Dev_AnyNodeJSProject_CollectPackagesCodeSnippets implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Collect node_modules Code Snippets';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        const nodeModulesDir = pathMan.currentDir.GetDirectories().xFirstOrNull(d => d.Name === 'node_modules');
        if(!nodeModulesDir)
        {
            Dialog.error(`node_modules file not found @${pathMan.currentDir}`);
            return;
        }

        let count = 0;
        for(let dir of nodeModulesDir.GetDirectories())
        {
            const snippetsFile = new FileInfo(Path.join(dir.FullName, 'package.code-snippets'));
            if(snippetsFile.exists())
            {
                const dstPath = Path.join(pathMan.dstVscodeDir.FullName, `${dir.Name}.code-snippets`)
                Dialog.info(`Creating ${dstPath}`);

                snippetsFile.copyTo(dstPath);

                count ++;
            }
        }

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} .code-snippets file(s) have been created.`);
        }
    }
}
// #endregion

// #region Dev >> Any NodeJS Project >> List direct dependencies
@RegisterWalkthrough()
export class WTR_Dev_AnyNodeProject_ListDirectDependencies implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> List direct dependencies';

    async execAsync()
    {
        await Dialog.exec('npm list --depth=0');
    }
}
// #endregion

// #region Dev >> Develop wV Gotcha
@RegisterWalkthrough()
export class WTR_Dev_DevelopWvGotcha implements IWalkthrough
{
    text = `Dev >> Develop wV Gotcha`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/wv-gotcha`
        Dialog.info(`Pleae wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}
// #endregion

// #region Dev >> Any NodeJS Project >> Generate >> /.gitignore
@RegisterWalkthrough()
export class WTR_Dev_Generatate_AnyNodeJSProject_GitIgnore implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Generate >> /.gitignore';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.gitIgnore} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.gitIgnore.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} File ${CommonFileName.gitIgnore} has been created.`);
        }
    }
}
// #endregion

// #region Dev >> Any NodeJS Project >> Generate >> /tsconfig.json
@RegisterWalkthrough()
export class WTR_Dev_Generatate_AnyNodeJSProject_tsConfigJson implements IWalkthrough
{
    text = 'Dev >> Any NodeJS Project >> Generate >> /tsconfig.json';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(new FileInfo(pathMan.dstnTsConfigFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.tsConfigJson} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.tsConfigJson.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if(count < 1)
        {
            Dialog.error('No files translated!');
        }
        else
        {
            Dialog.success(`{${count}} File ${CommonFileName.tsConfigJson} has been created.`);
        }
    }
}
// #endregion

// #region Dev >> New .net Solution >> Generate >> New Clean Architecture Service
@RegisterWalkthrough()
export class WTR_Dev_NewDotNetSolution_GenCleanCodeService implements IWalkthrough
{
    text = 'Dev >> New .net Solution >> Generate >> New Clean Architecture Service';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(pathMan.currentDir.GetDirectories().xAny() || pathMan.currentDir.GetFiles().xAny())
        {
            Dialog.error(`Current directory is not empty!`);
            return;
        }

        const __TestFile_ = await Dialog.askForTextAsync('__TestFile_?');

        const srcDir = Path.join(CommonDirName.Template_RootDir_NewCleanArchitectureSolution);
        const count = UTemplateTranslator.$().translate(srcDir, ()=>true, new Map([['__TestFile_', __TestFile_]]));

        // Dialog.exec('npm install');

        Dialog.success(`{${count}} files has been created.`);
    }
}
// #endregion

// #region Dev >> New NodeJS Project >> Generate >> New Global Tool
@RegisterWalkthrough()
export class WTR_Dev_Generatate_NewNodeJSProject_GlobalTool implements IWalkthrough
{
    text = 'Dev >> New NodeJS Project >> Generate >> New Global Tool';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(pathMan.currentDir.GetDirectories().xAny() || pathMan.currentDir.GetFiles().xAny())
        {
            Dialog.error(`Current directory is not empty!`);
            return;
        }

        const ___PACKAGE_NAME = await Dialog.askForTextAsync('Package name?');

        const srcDir = Path.join(CommonDirName.Template_RootDir_NewNodeProject, 'GlobalTool');
        const count = UTemplateTranslator.$().translate(srcDir, ()=>true, new Map([['___PACKAGE_NAME', ___PACKAGE_NAME]]));

        Dialog.exec('npm install');

        Dialog.success(`{${count}} files has been created.`);
    }
}
// #endregion

// #region Dev >> View currently focused projects
@RegisterWalkthrough()
export class WTR_Dev_ViewCurrentlyFocusedProjects implements IWalkthrough
{
    text = `Dev >> View currently focused projects`; 
    async execAsync()
    {
        const path = `G:\\_MyProjects\\__CurrentProjects`
        Dialog.info(`Pleae wait for {${path}} to open`);
        Dialog.exec(`explorer \"${path}\"`);
    }
}
// #endregion

// #region Dev >> vscode >> empower >> /.vscode/settings.json
@RegisterWalkthrough()
export class WTR_Dev_vscode_empower_Settings implements IWalkthrough
{
    text = 'Dev >> vscode >> empower >> /.vscode/settings.json';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        // if(new FileInfo(pathMan.dstnWvSnippetsFilePath).exists())
        // {
        //     Dialog.warning(`${CommonFileName.wvSnippets} already exists`);
        //     return;
        // }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.settings.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector, new Map(), true);

        Dialog.success(`{${count}} File ${CommonFileName.wvSnippets} has been created.`);
    }
}
// #endregion

// #region Dev >> vscode >> empower >> /.vscode/wv.code-snippets
@RegisterWalkthrough()
export class WTR_Dev_vscode_empower_WvCodeSnippets implements IWalkthrough
{
    text = 'Dev >> vscode >> empower >> /.vscode/wv.code-snippets';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        if(new FileInfo(pathMan.dstnWvSnippetsFilePath).exists())
        {
            Dialog.warning(`${CommonFileName.wvSnippets} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.wvSnippets.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        Dialog.success(`{${count}} File ${CommonFileName.wvSnippets} has been created.`);
    }
}
// #endregion

// #region Fun >> Grap wallpapers
@RegisterWalkthrough()
export class WTR_Fun_GrapWallpapers implements IWalkthrough
{
    text = 'Fun >> Grap wallpapers';

    async execAsync()
    {
        const tempDirPath = path.join(wvDirectoryInfo.special.tempDir.fullName, 'wv-gotcha/grapped-wallpapers');
        const userHomeDir = wvDirectoryInfo.special.userProfile;
        const tempDir = new wvDirectoryInfo(tempDirPath);
        tempDir.ensure();
        
        Dialog.exec(`explorer \"${tempDir.fullName.xReplaceAll('/', '\\')}\"`);

        const spotListDirPath = Path.join(userHomeDir.fullName, `AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`);
        const bingImagePath = Path.join(userHomeDir.fullName, `/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper`);
        
        const spotLightFiles = new wvDirectoryInfo(spotListDirPath).getFiles().xWhere(f=>f.fileSize > 100000);
        for(let f of spotLightFiles)
        {
            f.copyTo(`${tempDir.fullName}/${f.name}.jpeg`);
        }
        
        const bingImageFile = new FileInfo(bingImagePath);

        if(bingImageFile.exists() === false)
        {
            Dialog.warning(`Bing image file doesn\'t exist @${bingImagePath}`);
        }
        else
        {
            bingImageFile.copyTo(`${tempDir.fullName}/${bingImageFile.name}.jpg`);
        }
        
        await Dialog.instructAsync('Please wait the grapped in folder to open in the explorer');
    }
}
// #endregion

// #region Notes >> New mindmap (.xmmap)
@RegisterWalkthrough()
export class WTR_Notes_NewMinMap implements IWalkthrough
{
    text = `Notes >> New mindmap (.xmmap)`; 
 
    async execAsync()
    {
        const pathMan = UPathMan.$();

        let docName!: string;
        while(true)
        {
            docName = await Dialog.askForTextAsync('Document Name?');
            const isValid = /^[0-9A-z \-\._\(\)]+$/.test(docName);
            if (!isValid)
            {
                Dialog.error("File name is expected to contains alphabets, numerics and {-,.,_,(,)} only");
                continue;
            }

            break;
        }
        
        var newFile = pathMan.getMindMapFile(docName);
        if(newFile.exists() === false)
        {
            const templateFile = new FileInfo(pathMan.xmmapTemplateFile.fullName);
            const content = templateFile.readAllText().xReplaceAll(TEMPLATE_PLACEHOLDER, docName);
            pathMan.getMindMapFile(docName).writeAllText(content);
        }

        Dialog.info(`Pleae wait for ${docName}.xmmap to open`);
        Dialog.exec(`\"${newFile.fullName}\"`);
    }
}
// #endregion

// #region Ops >> Any NodeJS Project >> package.json >> patch ++ (increment)
@RegisterWalkthrough()
export class WTR_Ops_AnyNodeJSProject_IncrementPatch implements IWalkthrough
{
    text = 'Ops >> Any NodeJS Project >> package.json >> patch ++ (increment)';

    async execAsync()
    {
        const pathMan = UPathMan.$();
        
        const currentDir = pathMan.currentDir.FullName;
        const pkgFile = new FileInfo(Path.join(currentDir, 'package.json'));

        if(pkgFile.exists() == false)
        {
            Dialog.error(`No package.json found @${currentDir}`)
            return;
        }

        Dialog.info(`File updated: ${pkgFile.fullName}`);
        const pkg = new PackageJson(pkgFile.fullName);

        pkg.incrementVersionPatch(true);
        Dialog.success(`Package version updated to ${pkg.version}`);
    }

}
// #endregion

// #region Ops >> Any Package NodeJS Project >> Publish (push)
@RegisterWalkthrough()
export class WTR_Ops_AnyNodePackageJSProject_Publish implements IWalkthrough
{
    text = 'Ops >> Any Package NodeJS Project >> Publish (push)';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        await Dialog.exec('tsc');
        await new WTR_Ops_AnyNodeJSProject_IncrementPatch().execAsync();
        await Dialog.exec('npm publish');
    }
}
// #endregion

// #region Ops >> Docker >> Container >> List running containers
@RegisterWalkthrough()
export class WTR_Ops_Docker_Container_ListRunning implements IWalkthrough
{
    text = 'Ops >> Docker >> Container >> List running containers';

    async execAsync()
    {
        await Dialog.exec('docker ps');
    }
}
// #endregion

// #region Ops >> Docker >> Image >> Export image to tar file
@RegisterWalkthrough()
export class WTR_Ops_Docker_Image_ExportToTar implements IWalkthrough
{
    text = 'Ops >> Docker >> Image >> Export image to tar file';

    async execAsync()
    {
        await Dialog.exec('docker image ls');
        const imageId = await Dialog.instructAsync('Pick an image Id from the above list');
        const outputFilePath = await Dialog.instructAsync('Output .tar file path?');
        await Dialog.exec(`docker image save ${imageId} ${outputFilePath}`);
    }
}
// #endregion

// #region Ops >> Find process whose port ...
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
// #endregion

// #region Ops >> NodeJS >> List globally installed packages
@RegisterWalkthrough()
export class WTR_Ops_ListGlobalyInstalledPackages implements IWalkthrough
{
    text = `Ops >> NodeJS >> List globally installed packages`; 
    async execAsync()
    {
        await Dialog.exec('npm list --global --depth=0');
    }
}
// #endregion

// #region Ops >> Pack your vscode Extension
@RegisterWalkthrough()
export class WTR_Ops_PackVsCodeExtension implements IWalkthrough
{
    text = 'Ops >> Pack your vscode Extension';

    async execAsync()
    {
        const pathMan = UPathMan.$();

        await Dialog.exec('tsc');
        await new WTR_Ops_AnyNodeJSProject_IncrementPatch().execAsync();
        await Dialog.exec('vsce package');
    }
}
// #endregion

// #region Git >> Ammend all work tree changes
@RegisterWalkthrough()
export class WTR_AmmendAllWorktreeChanges implements IWalkthrough
{
    text = 'Git >> Ammend all work tree changes';
    async execAsync()
    {
        Dialog.exec("git add .");
        Dialog.exec("git commit --amend");
    }
}
// #endregion

// #region Git >> List remote repos
@RegisterWalkthrough()
export class WTR_AmmendAll implements IWalkthrough
{
    text = 'Git >> List remote repos';
    async execAsync()
    {
        Dialog.exec("git remote -v");
    }
}
// #endregion

// #region Git >> Update remote origin
@RegisterWalkthrough()
export class WTR_UpdateRemoteOrigin implements IWalkthrough
{
    text = 'Git >> Change remote origin';
    async execAsync()
    {
        const url = await Dialog.askForTextAsync("The new origin URL?")
        Dialog.exec(`git remote set-url origin ${url}`);
    }
}
// #endregion

// #region vscode >> Create custom snippet from existing code
@RegisterWalkthrough()
export class WTR_CreateCustomSnippet implements IWalkthrough
{
    text = 'vscode >> Create custom snippet from existing code';
    async execAsync()
    {
        await Dialog.warning("Recall: Your naming convetion of the prefix is * followed by a descriptive name");
        await Dialog.warning("Give a Title but don't worry about the Description");
        await Dialog.instructAsync("Select the code you want to create a snippet from.");
        await Dialog.instructAsync("Ctrl + Shift + P -> Convert to a snippet");
        await Dialog.instructAsync("Follow the steps");
        await Dialog.instructAsync("Copy the snippet from the output window.");
        await Dialog.promptContinueAsync();
        await Dialog.instructAsync("Ctrl + Shift + P -> Configure user snippets");
        await Dialog.instructAsync("Select GSnippets.codesnippets");
        await Dialog.promptContinueAsync();
        await Dialog.instructAsync("Paste your snippet in GSnippets.codesnippets");
        await Dialog.promptContinueAsync();
        await Dialog.instructAsync(`Find syntax for editing placeholders here: "https://www.notion.so/vscode-code-snippets-syntax-06411fd9411549c4aadbe118e100f682?pvs=4"`);

    }
}
// #endregion

// #region git >> Untrack file or folder
@RegisterWalkthrough()
export class WTR_GitUntrackFileOrFolder implements IWalkthrough
{
    text = 'git >> Untrack file or folder'
    async execAsync()
    {
        let path = (await Dialog.askForTextAsync("To untrack File or folder RELATIVE path")).trim();
        if(new DirectoryInfo(Path.join(cwd(), path)).Exists())
        {
            if(!path.endsWith("/"))
            {
                Dialog.warning(`${path} is a directory. I added a trailing '/' for you. But get accustomed to add a trailing '/' to denote a directory in your future git commands.`)   
                path = `${path}/`;
            }
        }
        else if(!new FileInfo(Path.join(cwd(), path)).exists())
        {
            Dialog.error(`Path [${path}] doesn't exist!`);
            process.exit(0);
        }
        
        await Dialog.confirmThenExecAsync(`git rm --cached -r ${path}`, `This will make a "git change" of untracking the file/folder. To be commited by a next command.`);
        await Dialog.confirmThenExecAsync(`git status`, `This will run "git status" to make sure of untracking as a change.`)
        await Dialog.instructAsync(`Add this path  ${path}  as a line to .gitignore.`);
        await Dialog.ShowCompletion();
    }
}
// #endregion