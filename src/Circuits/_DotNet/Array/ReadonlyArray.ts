// @ts-ignore
interface ReadonlyArray<T>
{
    xCount(): number

    xReform<RType>(func:(op:T)=>RType): RType[]

    xSelectMany<RType>(func:(arg:T)=>RType[]): RType[]

    xSort(toSimpleValue: (arg:T)=>string|number|null): T[]

    xReverse(): T[]

    xForeach(func: (arg:T)=>void): void

    xAny(func?: (arg:T)=>boolean): boolean

    xAll(func?: (arg:T)=>boolean): boolean

    xIsEmpty(): boolean

    // xAdd(item: T): void

    // xEnsureItem(item:T, checker?: (item:T)=>boolean): T

    // xAddRange(items: any[]): void

    xUnion(another:T[]): T[]

    xWhere(func: (arg:T)=>boolean): T[]

    xItemAt(index:number): T

    xIndexOf(item:T):number

    // xRemoveAt(index:any): void

    // xRemoveRange(index:number, lenght:number): void

    // xRemoveWhere(func: (arg:T)=>boolean):void

    xGetRange(index:number, length:number|undefined) : T[]

    // xInsert(index:number, item:T): void

    xInsertRange(index:number, items:T[]): void

    xFirstOrNull(func?: (arg:T)=>boolean): T|null

    xFirst(func?: (arg:T)=>boolean):T

    xLastOrNull(func?: (arg:T)=>boolean):T|null

    xLast(func?: (arg:T)=>boolean):T

    xSkip(countToSkip:number): T[]

    xTake(countToTake:number): T[]

    xContains(obj:T):boolean

    xDistinct(): T[]

    xExcept(except:T[]): T[]

    xClone():T[]

    xIntersect(otherList:T[]):T[]
}