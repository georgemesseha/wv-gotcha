import {FileInfo, Encoding} from "decova-filesystem";
import { Exception } from "decova-dotnet-developer";

export class Json
{

    public static Load<T>(path: string, encoding:Encoding = Encoding.utf8): T
    {
        let file = new FileInfo(path);
        if(file.exists() === false) throw new Error(`Path [${path}] doesn't exist.`);
    
        let output:any;
        let content = '';
        try
        {
            content = file.readAllText(encoding);
        }
        catch(err)
        {
            throw new Exception(`Couldn't read file [${path}]`);
        }
    
        try
        {
            output = JSON.parse(content)
        }
        catch(err)
        {
            throw new Exception(`Couldn't parse file content as JSON [${content}]`);
        }

        return output as T;
    }

    public static populate(obj: object, jsonFile: string)
    {
        Object.assign(obj, this.Load(jsonFile));
    }

    public static TrySave(path:string, obj:object, overwriteExisting:boolean, beautify:boolean = false, encoding:Encoding = Encoding.utf8): boolean
    {
        const file = new FileInfo(path);
        if(file.exists() && overwriteExisting === false)
        {
            return false;
        }

        const text = beautify? JSON.stringify(obj, null, '\t') : JSON.stringify(obj);

        file.writeAllText(text);
        return true;
    }

    public static FromObject(obj: object|[]): string
    {
        return JSON.stringify(obj);
    } 

    public static Parse<T>(json: string): T
    {
        return JSON.parse(json) as T;
    }
    
}


