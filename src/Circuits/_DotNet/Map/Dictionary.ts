import { Exception } from "../Exceptions/Exceptions";
import { List } from "../Array/List";
export class KeyValuePair<TKey, TValue>
{
    public Key:TKey;
    public Value:TValue; 

    constructor(key: TKey, value:TValue)
    {
        this.Key = key;
        this.Value = value;
    }
}


type actionOnKeyValue<TKey, TValue> = (kv:KeyValuePair<TKey, TValue>) => void; 

export class Dictionary<TKey, TValue>
{ 
    public _map = new Map<TKey, TValue>();
    
    constructor(map?: Map<TKey, TValue>)
    {
        if(!map) map = new Map<TKey, TValue>()

        this._map = map
    }



    public Add(key:TKey, value:TValue):void
    {
        if(this._map.has(key))
            throw `The Dictionary aleardy has the specified key: ${key}`;     
        this._map.set(key, value);
    }
    public Ensure(key:TKey, value:TValue, overwriteIfExising: boolean = false): TValue
    {
        if(this._map.has(key))
        {
            if(overwriteIfExising)
            {
                this._map.set(key, value)
                return value
            }
            else
            {
                return this._map.get(key) as TValue;
            }
        }
        else
        {
            this._map.set(key, value);
            return value;
        }
    }

    public Get(key: TKey): TValue|undefined
    {
        return this._map.get(key);
    }

    public Set(key: TKey, value:TValue): void
    {
        this._map.set(key, value);
    }

    public UpdateOnlyIfAny(key: TKey, value:TValue): boolean
    {
        if(this._map.has(key))
        {
            this._map.set(key, value);
            return true;
        }
        else
        {
            return false;
        }
    }

    public Remove(key:TKey)
    {
        if(this._map.has(key) === false)
            throw new Exception(`Dictionary doesn't have key [${key}]`);
        this.EnsureRemoved(key);
    }
    public EnsureRemoved(key:TKey)
    {
       return this._map.delete(key);
    }

    public get Keys(): List<TKey> 
    {
        // @ts-ignore
        return new List<TKey>([... this._map.keys()]);
    }

    public get Values(): List<TValue>
    {
        // @ts-ignore
        return new List<TValue>([...this._map.values()]);
    }

    public Clear(): void
    {
        this._map.clear();
    }

    public Foreach(func: actionOnKeyValue<TKey, TValue>): void
    {
        // @ts-ignore
       for(let key of this._map.keys())
       {
          func(new KeyValuePair(key, this._map.get(key)!))
       }
    }

    public Contains(key:TKey): boolean
    {
        return this.Keys.Contains(key);
    }

    public get Count(): number
    {
        return this._map.size;
    }

    public static FromObjectProps(obj: object): Dictionary<string, unknown>
    {
        const output = new Dictionary<string, unknown>();
        output._map = new Map(Object.entries(obj));
        return output;
    }
}