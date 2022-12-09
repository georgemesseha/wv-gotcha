import 'decova-dotnet'
import { SemVersion } from "wv-semversion";
import { Json } from '../JSON/Json';

// interface LooseObject {
//     [key: string]: any
// }

export class PackageJson
{
    constructor(public FilePath: string)
    {
        Json.populate(this, this.FilePath);
    }

    name: string = '';
    version: string = '';
    liscense: string = '';
    main: string = '';
    module: string = '';
    description: string = '';
    sourceMap: boolean = true;
    inlineSourceMap: boolean = false;
    outDir: string = '';


    private _scripts: string[] = [];
    get scriptList(): string[]
    {
        return this._scripts;
    }
    files: string[] = [];
    get fileList(): string[]
    {
        return this.files;
    }
    private keywords: string[] = [];
    get keywordList(): string[]
    {
        return this.keywords;
    }
    private dependencies: object = new Object();
    get dependencyMap(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.dependencies);
        // return Dictionary.FromObjectProps<string>(this.dependencies);
    }

    hasAsDependency(depName: string)
    {
        return Object.getOwnPropertyNames(this.dependencies).xAny(p => p == depName) 
    }


    private bin: object = new Object();
    get binMap(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.bin);
    }
    
    private devDependencies: object = new Object();
    get devDependencyMap(): Map<string, string>
    {
        return Map.FromObjectProps<string>(this.devDependencies);
    }

    saveAs(filePath: string)
    {
        const objToSave = { ...this };
        delete (objToSave as any).FilePath;
        Json.TrySave(filePath, objToSave, true, true);
    }

    save()
    {
        this.saveAs(this.FilePath);
    }

    incrementVersionPatch(autoSave: boolean = false)
    {
        try 
        {
            const version = new SemVersion(this.version);
            version.patch ++;
            this.version = version.toString();

            if(autoSave)
            {
                this.save();
            }
        } 
        catch (err) 
        {
            console.log(err);
            throw err;
        }
    }
}
