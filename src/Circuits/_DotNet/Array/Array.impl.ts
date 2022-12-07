import './Array.types';
import './ReadonlyArray';
import { List } from "./List";
import { Constructor, TypeInfo } from '..';

let proto:any = Array.prototype

type T = {};


proto.xCount = function(): number
{
    return this.length;
}

proto.xSelect = function<RType>(mapper: (op:T)=>RType) : RType[]
{
    return new List<any>(this).Select(mapper as any).Array as RType[];
}

proto.xSelectMany = function<RType>(func:(arg:T)=>RType[]): RType[]
{
    return new List<any>(this).SelectMany(func as any).Array as RType[];
}

proto.xSort = function(compareFn: (a:T, b:T)=>number): T[] 
{
    return new List<any>(this).Sort(compareFn).Array;
}

proto.xReverse = function(): T[]
{
    return new List<T>(this).Array
}

proto.xForeach = function(func: (arg:T)=>void):void
{
    new List<T>(this).Foreach(i => func(i));
}

proto.xAny = function(func?:(arg:T)=>boolean):boolean
{
    return new List<T>(this).Any(func);
}

proto.xAll = function(func:(arg:T)=>boolean): boolean
{
    return new List<T>(this).All(func)
}
    
proto.xIsEmpty = function(): boolean
{
    return this.length == 0;
}

proto.xAdd = function(item:T):void
{
    this.push(item);
}
    /** Only if the item doesn't exist in the list it adds it and returns true, otherwise it returns false */
proto.xEnsureItem = function(item:T, comparer?:(obj1:T, obj2:T)=>boolean): any
{
    const lst = new List<any>(this);
    return lst.EnsureItem(item, comparer);
}

proto.xAddRange = function(items: T[]): void
{
    new List<T>(this).AddRange(items)
}

proto.xUnion = function(another:T[]): T[]
{
    return new List<T>(this).Union(another).Array
}

proto.xWhere = function(func: (arg:T)=>boolean): T[]
{
    return new List<T>(this).Where(func).Array
}

proto.xItemAt = function(index:number): T
{
    return new List<T>(this).ItemAt(index);
}

proto.xIndexOf = function(item:T): number
{
    return new List<T>(this).IndexOf(item)
}

proto.xRemoveAt = function(index:any): void
{
    new List<T>(this).RemoveAt(index)
}

proto.xOfType = function<T>(type: Constructor<T>): T[]
{
    return this.xWhere((i: any) => TypeInfo.of(type).isAssignableFrom(TypeInfo.ofObject(i)));
}

proto.xRemoveRange = function(index:number, lenght:number): {removed: T[]}
{
    const output = new List<T>(this).RemoveRange(index, lenght)
    return output;
}

proto.xRemoveWhere = function(func:(arg:T)=>boolean): {removedItems: T[]}
{
    const output = new List<T>(this).RemoveWhere(func);
    return output;
}

proto.xGetRange = function(index:number, length:number|undefined=undefined) : T[]
{
    return new List<T>(this).GetRange(index, length).Array
}

proto.xInsert = function(index:number, item:T): void
{
    new List<T>(this).Insert(index, item);
}

proto.xInsertRange = function(index:number, items:T[]): void
{
    new List<T>(this).InsertRange(index, items)
}

proto.xFirstOrNull = function(func?: (arg:T)=>boolean): T|null
{
    return new List<T>(this).FirstOrNull(func)
}

proto.xFirst = function(func?: (arg:T)=>boolean):T
{
    return new List<T>(this).First(func);    
}

proto.xLastOrNull = function(func?: (arg:T)=>boolean):T|null
{
    return new List<T>(this).LastOrNull(func)
}

proto.xLast = function(func?: (arg:T)=>boolean):T
{
    return new List<T>(this).Last(func)
}

proto.xSkip = function(countToSkip:number): T[]
{
    return new List<T>(this).Skip(countToSkip).Array
}

proto.xTake = function(countToTake:number): T[]
{
    return new List<T>(this).Array
}

proto.xContains = function(obj:T):boolean
{
    return new List<T>(this).Contains(obj)
}

proto.xDistinct = function(): T[]
{
   return new List<T>(this).Distinct().Array 
}

proto.xExcept = function(except:T[]): T[]
{
    return new List<T>(this).Except(except).Array
}


proto.xClone = function():T[]
{
    return new List<T>(this).Array
}

proto.xIntersect = function(otherArray:T[]):T[]
{
    return new List<T>(this).Intersect(otherArray).Array
}


proto.xToMap = function<TKey>(keySelector: (item: T)=>TKey, distinctItems:boolean=false): Map<TKey, T[]>
{
    return new List<T>(this).ToMap(keySelector, distinctItems);
}

proto.xReset = function(): void
{
    new List<T>(this).Reset();
}

proto.xRemoveWhere = function (selector: (arg: T) => boolean) {
    const output = new List<T>(this).RemoveWhere(selector);
    return output;
};

proto.xEnsureItem = function(item: T, comparer?: (item1: T, item2: T) => boolean): T
{
    const lst = new List<T>(this);
    return lst.EnsureItem(item, comparer);
};

proto.xOfType = function<T>(type: new (...args: any[]) => T) : T[]
{
    const lst = new List<T>(this);
    return lst.Where(item => !item && TypeInfo.of(type).isAssignableFrom((item as any).constructor)).Array;
};

