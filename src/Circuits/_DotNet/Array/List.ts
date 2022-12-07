import { Func } from "../CommonDelegates";
import '../index'
import { Exception } from "../index";

/** It works as a proxy to the native Array<T>. It provides the methods expected by a dotnet
 * Linq like functions plus some more methods.
 */
export class List<T>
{
    constructor(array: Array<T>/*|Iterable<T>|IterableIterator<T>|ArrayLike<T>*/ | null = null)
    {
        if (array == null)
        {
            this._Array = new Array<T>();
        }
        else if (Object.getOwnPropertyDescriptor(array, "iterator") != null)
        {
            // @ts-ignore
            this._Array = [...array as Iterable<T>];
        }
        else
        {
            this._Array = array;
        }
    }

    public get Items(): Array<T>
    {
        return this._Array;
    }

    private _Array: Array<T>;
    public get Array(): Array<T>
    {
        return this._Array;
    }

    public get Count(): number
    {
        return this.Array.length;
    }
    public Select<RType>(func: Func<T, RType>): List<RType>
    {
        var newArr = this.Array.map(item => func(item));
        return new List<RType>(newArr);
    }
    public SelectMany<RType>(func: (arg: T) => RType[]): List<RType>
    {
        let result = new List<RType>([]);

        for (let x = 0; x < this.Array.length; x++)
        {
            let itemResult: RType[] = func((this.Array[x]) as unknown as T);
            if (itemResult != null) 
            {
                result.AddRange(itemResult);
            }
            // throw `@[List.SelectMany(func) func returned undefined value!]`;
        }
        return result;
    }
    public Sort(compareFun: (a: T, b: T) => number): List<T> 
    {
        const copy = this.Clone();
        copy.Array.sort(compareFun);

        return copy;
    }
    public Reverse(): List<T>
    {
        const copy = this.Clone();
        copy.Array.reverse();
        return copy;
    }
    public Foreach(func: (arg: T) => void): void
    {
        this.Array.map(item => func(item));
    }
    public Any(func?: (arg: T) => boolean): boolean
    {
        if (func == null) return this.Array.length > 0;

        for (let x = 0; x < this.Array.length; x++)
        {
            if (func(this.Array[x] as T) === true)
            {
                return true;
            }
        }
        return false;
    }
    public All(func: (arg: T) => boolean)
    {
        for (let item of this._Array)
        {
            if (func(item) === false) return false;
        }

        return true;
    }
    public get IsEmpty(): boolean
    {
        return this._Array.length === 0;
    }

    public Add(item: T): void
    {
        this.Array.push(item);
    }
    /** Only if the item doesn't exist in the list it adds it and returns true, otherwise it returns false */
    public EnsureItem(item: T, comparer?: (obj1: T, obj2:T) => boolean): T
    {
        comparer = comparer ?? ((obj1:any, obj2:any) => obj1 === obj2)
        let existing = this.FirstOrNull(exst => comparer!(exst, item))
        if (!existing)
        {
            this.Add(item);
            return item;
        }
        
        return existing;
    }
    public AddRange(items: List<T> | Array<T>)
    {
        if (items == null) throw new Exception(`@[List.AddRange(items)] NullArgumentException`);

        if (items.constructor === Array)
        {
            this._Array.push(...items as Array<T>);
        }
        else
        {
            this._Array.push(...(items as List<T>).Array);
        }
    }
    public Union(another: List<T> | Array<T>): List<T>
    {
        const newOne: List<T> = another.constructor === List ? another : new List<T>(another as Array<T>);
        const output = this.Items.concat(newOne.Items);
        return new List<T>(output).Distinct();
    }

    public Where(func: Func<T, boolean>): List<T>
    {
        let result = this.Array.filter(e => func(e));
        return new List<T>(result);
    }
    public ItemAt(index: number): T
    {
        return this.Array[index] as T;
    }
    public IndexOf(item: T): number
    {
        for (let i = 0; i < this.Array.length; i++)
        {
            if (this.Array[i] === item) return i;
        }

        return -1;
    }
    public RemoveAt(index: any): { removedItem: T }
    {
        const removedItem = this.Array[index];
        this.Array.splice(index, 1);

        return { removedItem };
    }
    public RemoveRange(index: number, length: number): { removed: T[] }
    {
        if (index + length > this.Array.length) throw new Error("Range to remove is out of the List range!");

        const removed = this.Skip(index).Take(length);
        this.Array.splice(index, length);

        return { removed: removed._Array };
    }
    public RemoveWhere(func: Func<T, boolean>): { removedItems: T[] }
    {
        const removed = [];
        for (let x = 0; x < this.Array.length; x++)
        {
            if (func(this.Array[x]))
            {
                removed.push(this.Array[x]);
                this.RemoveAt(x);
                x--;
            }
        }

        return { removedItems: removed };
    }
    public GetRange(index: number, length: number | undefined = undefined): List<T>
    {
        if (length === undefined)
        {
            length = this.Array.length - index;
        }

        if (index + length > this.Array.length) throw new Error("range is out of List's range");

        return new List<T>(this.Array.slice(index, index + length));
    }
    public Insert(index: number, item: T)
    {
        this.Array.splice(index, 0, item);
    }
    public InsertRange(index: number, items: List<T> | Array<T>)
    {
        let inputArr: Array<T>;
        if (items.constructor === List)
        {
            inputArr = (items as List<T>).Array;
        }
        else
        {
            inputArr = items as Array<T>;
        }

        let before = this.GetRange(0, index);
        let after = this.GetRange(index) as List<T>;

        let output = before.Clone();
        output.AddRange(new List<T>(inputArr));
        output.AddRange(after);

        this._Array = output.Array;
    }
    public FirstOrNull(func?: Func<T, boolean>)
    {
        if (func == null)
        {
            if (this.Array.length === 0)
            {
                return null;
            }
            else
            {
                return this.Array[0];
            }
        }

        for (let x = 0; x < this.Array.length; x++)
        {
            if (func(this.Array[x]) === true)
            {
                return this.Array[x];
            }
        }
        return null;
    }
    public First(func?: Func<T, boolean>): T
    {
        let result = this.FirstOrNull(func);
        if (result == null)
        {
            throw new Exception("Array.xFirst() didn't find any matching element. If you're not sure of returning an elememt, use FirstOrNull() instead.");
        }
        else
        {
            return result;
        }
    }
    public LastOrNull(func: Func<T, boolean> | null = null): T | null
    {
        if (this.Array.length === 0) return null;

        if (func == null) return this.Array[this.Array.length - 1];

        for (let x = this.Array.length - 1; x >= 0; x--)
        {
            if (func(this.Array[x]) === true)
            {
                return this.Array[x];
            }
        }

        return null;
    }
    public Last(func: Func<T, boolean> | null = null): T
    {
        let result = this.LastOrNull(func);
        if (result == null)
        {
            throw new Exception("Array.xLast() didn't find any matching element. If you're not sure of returning an elememt, use FirstOrNull() instead.");
        }
        else
        {
            return result;
        }
    }
    public Skip(countToSkip: number): List<T>
    {
        if (countToSkip > this.Array.length) throw new Error("countToSkip is out of range!");
        return new List<T>(this.Array.slice(countToSkip));
    }
    public Take(countToTake: number): List<T>
    {
        if (countToTake > this.Array.length) throw new Error("countToTake is out of range!");
        return new List<T>(this.Array.slice(0, countToTake));
    }
    public Contains(obj: T): boolean
    {
        return this.Any(o => o === obj);
    }
    public Distinct(): List<T>
    {
        function onlyUnique(value: any, index: number, self: any) 
        {
            return self.indexOf(value) === index;
        }
        return new List<T>(this.Array.filter(onlyUnique));
    }
    public Except(excepted: List<T> | T[]): List<T>
    {
        if (excepted.constructor === Array) excepted = new List<T>(excepted)

        let result = new List<T>(new Array<T>());

        for (let x = 0; x < this.Array.length; x++)
        {
            if (!(excepted as List<T>).Contains(this.Array[x]))
            {
                result.Add(this.Array[x]);
            }
        }

        return result;
    }
    public Clone(): List<T>
    {
        let result = new List<T>([]);
        result.AddRange(this.Array);
        return result;
    }

    /** Returns the intersection of this list and the passed one. In case there are repitions in any
     * or in the both of them they will be ignored. i.e, distinct items returned.
     */
    public Intersect(otherList: List<T> | T[]): List<T>
    {
        if (otherList.constructor === Array) otherList = new List<T>(otherList)

        let result = new List<T>(new Array<T>());

        let otherListCopy = (otherList as List<T>).Clone();
        let thisListCopy = this.Clone();

        while (thisListCopy.Any() && otherListCopy.Any())
        {
            let item = thisListCopy.Array[0];

            let common = otherListCopy.FirstOrNull(i => i === item);
            if (common == null) 
            {
                thisListCopy.RemoveWhere((i: T) => i === item);
            }
            else
            {
                result.Add(item);
                thisListCopy.RemoveWhere((i: T) => i === item);
                otherListCopy.RemoveWhere((i: T) => i === item);
            }
        }

        return result;
    }

    public Reset(): void
    {
        this.Array.length = 0;
    }

    

    public ToMap<TKey>(keySelector: (item: T)=>TKey, distinctItems:boolean): Map<TKey, T[]>
    {
        const map = new Map<TKey, T[]>();
        for(let item of this.Array)
        {
            const key = keySelector(item);
            const arr = map.xEnsure(key, [], false);
            
            if(distinctItems)
            {
                new List(arr).EnsureItem(item);
            }
            else
            {
                new List(arr).Add(item);
            }
        }

        return map;
    }

    public _EnsureObservers(): ((changedArray: Array<T>, added: Array<T>, removed: Array<T>)=>void)[]
    {
        if (!(this.Array as any)[FN_NAME_onChangedHandlers])
        {
            (this.Array as any)[FN_NAME_onChangedHandlers] = [];
        }

        return (this.Array as any)[FN_NAME_onChangedHandlers];
    }
}

const FN_NAME_onChangedHandlers = "_onChangedHandlers";

// }

// let x = new List<string>(['George', 'Sherine', 'Joseph', 'Sameh', 'Mohsen', 'Kimo']);

// let y = new List<string>(['Abdo', 'Mohsen', 'George', 'Abd-ElSameee', 'George', 'Abdo', 'Mohsen', 'Kimo']);

// console.log(y.intersect(x));
// console.log(x.take(2));
// console.log(y.skip(3))
// console.log(y.distinct())
// console.log(y.getRange(3,3))
// console.log(x.last())
// let clone = x.clone();
// clone.removeRange(0, 4);
// console.log("clone", clone);
// console.log();
// console.log(x);

