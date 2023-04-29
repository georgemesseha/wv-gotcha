import { Dialog } from "./Dialog";
import { Mcq } from "./Mcq";
import { IWalkthrough } from "./Walkthroughs/_Foundation/IWalkthrough";

class Mcq_Code extends Mcq<IWalkthrough>
{
    protected get _deduceOptionTest(): (option: IWalkthrough) => string
    {
        return option => option.text;
    }
    protected options = [
        new WTR_Code_Circuits(),
        new WTR_Code_AngularSample(),
        new WTR_Code_ReactSample(),
        new WTR_Code_Contracts(),
        new WTR_Code_Extension(),
        new WTR_Code_View(),
        new WTR_Code_Gotcha(),
        new WTR_Code_LocalService(),
        new WTR_Code_LocalBroker(),
        new WTR_Code_ExtensionResources(),
    ];
}


export class Mcq_CircuitsTasks extends Mcq<IWalkthrough>
{
    protected get _deduceOptionTest(): (option: IWalkthrough) => string
    {
        return (option: IWalkthrough) =>
        {
            return option.text;
        }
    }
    protected options:IWalkthrough[] = [
        new WTR_Code(),
        new WTR_BuildView(),
        new WTR_RunTempBroker(),

    ];
}

class WTR_Code implements IWalkthrough
{
    text = `Code`; 
    async execAsync()
    {
        const walkthrough = await new Mcq_Code().selectAsync('Code what?');
        await walkthrough.execAsync();
    }
}

class WTR_Code_Circuits implements IWalkthrough
{
    text = `Code Circuits`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/wv-circuits`
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}

class WTR_Code_ExtensionResources implements IWalkthrough
{
    text = `Extension Resources`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/circuit-bench-site/vscode-extension-resources`
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}

class WTR_Code_AngularSample implements IWalkthrough
{
    text = `Code Angular-Sample`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/circuits-sample-angular`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
        // Dialog.exec(`npm run update-dep`, path);
    }
}


class WTR_Code_ReactSample implements IWalkthrough
{
    text = `Code React-Sample`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/circuits-sample-react`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
        // Dialog.exec(`npm run update-dep`, path);
    }
}

class WTR_Code_View implements IWalkthrough
{
    text = `Code View`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/extension-view`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
        // Dialog.exec(`npm run update-dep`, path);
    }
}

class WTR_Code_Gotcha implements IWalkthrough
{
    text = `Code Gotcha`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/wv-gotcha`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}

class WTR_Code_Extension implements IWalkthrough
{
    text = `Code Extension`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/extension`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
        // Dialog.exec(`npm run update-dep`, path);
    }
}

class WTR_Code_Contracts implements IWalkthrough
{
    text = `Code Contracts`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/_FinalCircuits/contracts`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
        // Dialog.exec(`npm run update-dep`, path);
    }
}

class WTR_Code_LocalService implements IWalkthrough
{
    text = `Code Local Service`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/wv-local-service`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}

class WTR_Code_LocalBroker implements IWalkthrough
{
    text = `Code Local Broker`; 
    async execAsync()
    {
        const path = `G:/_MyProjects/_MyNodeProjects/wv-local-service-broker`;
        Dialog.info(`Please wait for vscode to open`);
        Dialog.exec(`code \"${path}\"`);
    }
}

class WTR_BuildView implements IWalkthrough
{
    text = 'Build the view';

    execAsync(): Promise<void>
    {
        Dialog.exec('npm run build', 'G:/_MyProjects/_MyNodeProjects/_FinalCircuits/extension-view');

        return Promise.resolve();
    }
    
}

class WTR_RunTempBroker implements IWalkthrough
{
    text = 'Run temp broker';

    execAsync(): Promise<void>
    {
        Dialog.exec('node ./dist/run',`G:/_MyProjects/_MyNodeProjects/wv-local-service-broker`);

        return Promise.resolve();
    }
    
}