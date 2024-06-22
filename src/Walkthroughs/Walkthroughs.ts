import { Shell } from "../Shell";
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
import { Git } from "../Libraries/Git/Git";
import { Mcq } from "../Mcq";
import { DynamicMcq } from "../DynamicMcq";

const fs = require('fs');
const os = require('os');
const path = require('path');



// #region Deno-Publish
@RegisterWalkthrough()
export class WTR_DenoPublish implements IWalkthrough
{
    text = `Deno-Publish`;

    async execAsync()
    {
        const comment = await Shell.askForTextAsync(`commit comment:`);
        Shell.hintWillExec('Commiting and pushing your changes? press ENTER to continue');
        await Shell.promptContinueAsync();
        Shell.exec(`git add .`);
        Shell.exec(`git commit -m "${comment}"`);
        Shell.exec(`git push`);

        Shell.hintWillExec('Openning releases page:');
        const dirName = UPathMan.$().currentDir.Name;
        const releaseUrl = `https://github.com/wV-software/${dirName}/releases/`;
        // const releaseUrl = `https://github.com/wV-software/wv_core/releases/`;
        Shell.exec(`start ${releaseUrl}`);
        await Shell.instructAsync(`Find "Draft a new realse" button to start`);

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
        Shell.exec(`git config --global core.editor "code --wait"`);
        Shell.exec(`git config --global -e`);
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
        Shell.exec(`git branch`);
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
            for (const pattern of translationMapping.fileRelPathPatternsToIgnore ?? [])
            {
                try
                {
                    if (Regex.parse(pattern).hasMatches(srcFileRelPath))
                    {
                        Shell.warning(`File '${srcFileRelPath}' skipped by 'fileRelPathPatternsToIgnore = '${pattern}'`);
                        return false;
                    }
                }
                catch (exp)
                {
                    Shell.error(`fileRelPathPatternsToIgnore = '${pattern}' is not a valid Regex pattern.`);
                    return false;
                }
            }

            const isTranslated = await UTemplateTranslator.$().translateGenericTemplateFileAsync(templateDirName, srcFileRelPath, []);
            return isTranslated;
        }

        for (let translationItem of translationMapping.translationItems)
        {
            switch (translationItem.itemType)
            {
                case "file":
                    const srcFileRelPath = translationItem.relativePath;
                    const isTranslated = await translateFileAsync(srcFileRelPath);
                    if (isTranslated) count++;
                    break;
                case "folder":
                    const folder = new DirectoryInfo(Path.join(UPathMan.$().contentDir.FullName));
                    if (folder.Exists() === false) 
                    {
                        Shell.error(`Folder '${translationItem.relativePath}' doesn't exist!`)
                        continue;
                    }
                    break;
            }
        }

        if (count < 1)
        {
            Shell.error('No files translated!');
        }
        else
        {
            if (count > 1)
            {
                Shell.success(`{${count}} Files have been created.`);
            }
            else
            {
                Shell.success(`1 File has been created.`);
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

        if (new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        {
            Shell.warning(`${CommonFileName.gitIgnore} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.gitIgnore.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyDotNetProject, fileSelector);

        if (count < 1)
        {
            Shell.error('No files translated!');
        }
        else
        {
            Shell.success(`{${count}} File ${CommonFileName.gitIgnore} has been created.`);
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
        while (true)
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
        if (!nodeModulesDir)
        {
            Shell.error(`node_modules file not found @${pathMan.currentDir}`);
            return;
        }

        let count = 0;
        for (let dir of nodeModulesDir.GetDirectories())
        {
            const snippetsFile = new FileInfo(Path.join(dir.FullName, 'package.code-snippets'));
            if (snippetsFile.exists())
            {
                const dstPath = Path.join(pathMan.dstVscodeDir.FullName, `${dir.Name}.code-snippets`)
                Shell.info(`Creating ${dstPath}`);

                snippetsFile.copyTo(dstPath);

                count++;
            }
        }

        if (count < 1)
        {
            Shell.error('No files translated!');
        }
        else
        {
            Shell.success(`{${count}} .code-snippets file(s) have been created.`);
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
        await Shell.exec('npm list --depth=0');
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
        Shell.info(`Pleae wait for vscode to open`);
        Shell.exec(`code \"${path}\"`);
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

        if (new FileInfo(pathMan.dstnGitIgnoreFilePath).exists())
        {
            Shell.warning(`${CommonFileName.gitIgnore} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.gitIgnore.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if (count < 1)
        {
            Shell.error('No files translated!');
        }
        else
        {
            Shell.success(`{${count}} File ${CommonFileName.gitIgnore} has been created.`);
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

        if (new FileInfo(pathMan.dstnTsConfigFilePath).exists())
        {
            Shell.warning(`${CommonFileName.tsConfigJson} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.tsConfigJson.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        if (count < 1)
        {
            Shell.error('No files translated!');
        }
        else
        {
            Shell.success(`{${count}} File ${CommonFileName.tsConfigJson} has been created.`);
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

        if (pathMan.currentDir.GetDirectories().xAny() || pathMan.currentDir.GetFiles().xAny())
        {
            Shell.error(`Current directory is not empty!`);
            return;
        }

        const __TestFile_ = await Shell.askForTextAsync('__TestFile_?');

        const srcDir = Path.join(CommonDirName.Template_RootDir_NewCleanArchitectureSolution);
        const count = UTemplateTranslator.$().translate(srcDir, () => true, new Map([['__TestFile_', __TestFile_]]));

        // Dialog.exec('npm install');

        Shell.success(`{${count}} files has been created.`);
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

        if (pathMan.currentDir.GetDirectories().xAny() || pathMan.currentDir.GetFiles().xAny())
        {
            Shell.error(`Current directory is not empty!`);
            return;
        }

        const ___PACKAGE_NAME = await Shell.askForTextAsync('Package name?');

        const srcDir = Path.join(CommonDirName.Template_RootDir_NewNodeProject, 'GlobalTool');
        const count = UTemplateTranslator.$().translate(srcDir, () => true, new Map([['___PACKAGE_NAME', ___PACKAGE_NAME]]));

        Shell.exec('npm install');

        Shell.success(`{${count}} files has been created.`);
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
        Shell.info(`Pleae wait for {${path}} to open`);
        Shell.exec(`explorer \"${path}\"`);
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

        Shell.success(`{${count}} File ${CommonFileName.wvSnippets} has been created.`);
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

        if (new FileInfo(pathMan.dstnWvSnippetsFilePath).exists())
        {
            Shell.warning(`${CommonFileName.wvSnippets} already exists`);
            return;
        }

        function fileSelector(path: string): boolean
        {
            return new FileInfo(path).name.toLowerCase() === CommonFileName.wvSnippets.toLowerCase();
        }

        const count = UTemplateTranslator.$().translate(CommonDirName.Template_RootDir_AnyNodeProject, fileSelector);

        Shell.success(`{${count}} File ${CommonFileName.wvSnippets} has been created.`);
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

        Shell.exec(`explorer \"${tempDir.fullName.xReplaceAll('/', '\\')}\"`);

        const spotListDirPath = Path.join(userHomeDir.fullName, `AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`);
        const bingImagePath = Path.join(userHomeDir.fullName, `/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper`);

        const spotLightFiles = new wvDirectoryInfo(spotListDirPath).getFiles().xWhere(f => f.fileSize > 100000);
        for (let f of spotLightFiles)
        {
            f.copyTo(`${tempDir.fullName}/${f.name}.jpeg`);
        }

        const bingImageFile = new FileInfo(bingImagePath);

        if (bingImageFile.exists() === false)
        {
            Shell.warning(`Bing image file doesn\'t exist @${bingImagePath}`);
        }
        else
        {
            bingImageFile.copyTo(`${tempDir.fullName}/${bingImageFile.name}.jpg`);
        }

        await Shell.instructAsync('Please wait the grapped in folder to open in the explorer');
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
        while (true)
        {
            docName = await Shell.askForTextAsync('Document Name?');
            const isValid = /^[0-9A-z \-\._\(\)]+$/.test(docName);
            if (!isValid)
            {
                Shell.error("File name is expected to contains alphabets, numerics and {-,.,_,(,)} only");
                continue;
            }

            break;
        }

        var newFile = pathMan.getMindMapFile(docName);
        if (newFile.exists() === false)
        {
            const templateFile = new FileInfo(pathMan.xmmapTemplateFile.fullName);
            const content = templateFile.readAllText().xReplaceAll(TEMPLATE_PLACEHOLDER, docName);
            pathMan.getMindMapFile(docName).writeAllText(content);
        }

        Shell.info(`Pleae wait for ${docName}.xmmap to open`);
        Shell.exec(`\"${newFile.fullName}\"`);
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

        if (pkgFile.exists() == false)
        {
            Shell.error(`No package.json found @${currentDir}`)
            return;
        }

        Shell.info(`File updated: ${pkgFile.fullName}`);
        const pkg = new PackageJson(pkgFile.fullName);

        pkg.incrementVersionPatch(true);
        Shell.success(`Package version updated to ${pkg.version}`);
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

        await Shell.exec('tsc');
        await new WTR_Ops_AnyNodeJSProject_IncrementPatch().execAsync();
        await Shell.exec('npm publish');
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
        await Shell.exec('docker ps');
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
        await Shell.exec('docker image ls');
        const imageId = await Shell.instructAsync('Pick an image Id from the above list');
        const outputFilePath = await Shell.instructAsync('Output .tar file path?');
        await Shell.exec(`docker image save ${imageId} ${outputFilePath}`);
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
        const port = await Shell.askForTextAsync('Port?')
        Shell.exec(`netstat -ano | findstr :${port}`);

        Shell.instructAsync(`Pick a PID from the above list`);
        const pid = await Shell.askForTextAsync('PID?');
        Shell.exec(`tasklist /svc /FI \"PID eq ${pid}\"`);
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
        await Shell.exec('npm list --global --depth=0');
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

        await Shell.exec('tsc');
        await new WTR_Ops_AnyNodeJSProject_IncrementPatch().execAsync();
        await Shell.exec('vsce package');
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
        Shell.exec("git add .");
        Shell.exec("git commit --amend");
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
        Shell.exec("git remote -v");
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
        const url = await Shell.askForTextAsync("The new origin URL?")
        Shell.exec(`git remote set-url origin ${url}`);
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
        await Shell.warning("Recall: Your naming convetion of the prefix is * followed by a descriptive name");
        await Shell.warning("Give a Title but don't worry about the Description");
        await Shell.instructAsync("Select the code you want to create a snippet from.");
        await Shell.instructAsync("Ctrl + Shift + P -> Convert to a snippet");
        await Shell.instructAsync("Follow the steps");
        await Shell.instructAsync("Copy the snippet from the output window.");
        await Shell.instructAsync("Ctrl + Shift + P -> Configure user snippets");
        await Shell.instructAsync("Select GSnippets.codesnippets");
        await Shell.instructAsync("Paste your snippet in GSnippets.codesnippets");
        await Shell.instructAsync(`Find syntax for editing placeholders here: "https://www.notion.so/vscode-code-snippets-syntax-06411fd9411549c4aadbe118e100f682?pvs=4"`);
        await Shell.info("GSnippets.codesnippets will be synced automatically by vscode.");
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
        let path = (await Shell.askForTextAsync("To untrack File or folder RELATIVE path")).trim();
        if (new DirectoryInfo(Path.join(cwd(), path)).Exists())
        {
            if (!path.endsWith("/"))
            {
                Shell.warning(`${path} is a directory. I added a trailing '/' for you. But get accustomed to add a trailing '/' to denote a directory in your future git commands.`)
                path = `${path}/`;
            }
        }
        else if (!new FileInfo(Path.join(cwd(), path)).exists())
        {
            Shell.error(`Path [${path}] doesn't exist!`);
            process.exit(0);
        }

        await Shell.confirmThenExecAsync(`git rm --cached -r ${path}`, `This will make a "git change" of untracking the file/folder. To be commited by a next command.`);
        await Shell.confirmThenExecAsync(`git status`, `This will run "git status" to make sure of untracking as a change.`)
        await Shell.instructAsync(`Add this path  ${path}  as a line to .gitignore.`);
        await Shell.ShowCompletion();
    }
}
//#endregion 

// #region git >> Open remote repo in default browser
@RegisterWalkthrough()
export class WTR_GitOpenRemoteRepoInDefaultBrowser implements IWalkthrough
{
    text = 'git >> Open remote repo in default browser'
    async execAsync()
    {
        const remoteOrigin = await Git.getRemoteOriginAsync();
        Shell.openInBrowser(remoteOrigin);
        await Shell.instructAsync(remoteOrigin);
    }
}
// #endregion

// #region git >> amend to previous commit
@RegisterWalkthrough()
export class WTR_GitAmendToPreviousCommit implements IWalkthrough
{
    text = 'git >> amend to previous commit'
    async execAsync()
    {
        await Shell.confirmThenExecAsync("git commit --amend", "Will amend the already staged changes to the last commit!");
    }
}
// #endregion

// #region git >> Hard reset a branch to origin
@RegisterWalkthrough()
export class WTR_GitHardResetToOrigin implements IWalkthrough
{
    text = 'git >> Hard reset a branch to origin @ overwrite local remote'
    async execAsync()
    {
        const currentBranch = Git.getCurrentBranch();
        Shell.assert(`Are you aware that you're on branch  ${currentBranch} ?`);
        Shell.assert(`Are you sure you want the current branch to be overwritten by the origin?`);
        await Shell.confirmThenExecAsync("git fetch origin", "Will fetch the origin in local ref");
        await Shell.confirmThenExecAsync(`git reset --hard origin/${currentBranch}`, "Will overwrite the current local branch with the shortly updated local origin ref.");
    }
}
// #endregion

// #region git >> Create delta branch in favor of the current one
@RegisterWalkthrough()
export class WTR_GitCreateDeltaBranch implements IWalkthrough
{
    text = 'git >> Create delta branch in favor of the current one @ Dev, QC, Prod merge'
    async execAsync()
    {
        const sourceBranch = Git.getCurrentBranch().toLocaleLowerCase();
        if (sourceBranch.indexOf("/") >= 0)
        {
            Shell.terminate(`Current branch ${sourceBranch} seems to be a feature branch. Please select a main branch to be the source!`);
        }

        const allBranches = Git.getBranchNames();
        const destBranchs = allBranches.xExcept([sourceBranch]).xExcept(allBranches.xWhere(b => b.Contains("/")));
        
        let destBranch = await new DynamicMcq(destBranchs).selectAsync("Select destination brance");

        Shell.terminate("Dev break");

        const deltaBranchName = `delta_${sourceBranch}_${destBranch}_${Shell.getTimeStamp()}`;

        await Shell.warning(`The following branches will be overwritten by the origin:`);
        await Shell.printList("To be overwritten:", [sourceBranch, destBranch]);
        await Shell.assert("ARE YOU SURE?")

        await Shell.confirmThenExecAsync("git fetch origin", `Will fetch the origin of the current branch  ${sourceBranch}`);
        await Shell.confirmThenExecAsync(`git reset --hard origin/${sourceBranch}`, `Will reset the local branch ${sourceBranch} to match the origin!`)



        await Shell.confirmThenExecAsync(`git checkout -b ${deltaBranchName}`, `Will create a delta branch ${deltaBranchName} based on the current branch [The source branch]`);

        await Shell.confirmThenExecAsync(`git checkout ${destBranch}`, `Will check out the destination branch ${destBranch} for updating it.`);
        await Shell.confirmThenExecAsync(`git fetch origin`, `Will fetch the origin of the current branch  ${destBranch}`);
        await Shell.confirmThenExecAsync(`git reset --hard origin/${destBranch}`, `This will reset the local branch ${destBranch} to match the origin!`)

        await Shell.confirmThenExecAsync(`git checkout ${deltaBranchName}`, `Will check out the delta branch`);
        await Shell.confirmThenExecAsync(`git merge -s ours ${destBranch}`, `Will merge the destination branch ${destBranch} into the delta branch favoring the delta branch.`);

        // git push --set-upstream origin delta_master
        await Shell.confirmThenExecAsync(`git push --set-upstream origin ${deltaBranchName}`, `Will push ${deltaBranchName} for making a pull request of it to ${destBranch}`);
        await Shell.instructAsync(`I'm opening the remote repo in the browser for you to create a pull request of ${deltaBranchName} into ${destBranch}`);
        await Shell.openInBrowser(await Git.getRemoteOriginAsync());
        Shell.ShowCompletion();

        // just making a fake change
    }
}
// #endregion