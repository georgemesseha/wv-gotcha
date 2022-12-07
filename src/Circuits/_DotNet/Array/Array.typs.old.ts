// @ts-ignore
interface Array<T> {
    xCount(): number;
    xSelect<RType>(reformer: (op: T) => RType): RType[];
    xSelectMany<RType>(rangeSelector: (arg: T) => RType[]): RType[];
    xSort(comparFn: (a: T, b: T) => number): T[];
    xReverse(): T[];
    xForeach(action: (arg: T) => void): void;
    xAny(checker?: (arg: T) => boolean): boolean;
    xAll(checker?: (arg: T) => boolean): boolean;
    xIsEmpty(): boolean;
    xAdd(item: T): void;
    xEnsureItem(item: T, checker?: (item: T) => boolean): T;
    xAddRange(items: any[]): void;
    xUnion(another: T[]): T[];
    xWhere(selector: (arg: T) => boolean): T[];
    xItemAt(index: number): T;
    xIndexOf(item: T): number;
    xRemoveAt(index: any): void;
    xRemoveRange(index: number, length: number): void;
    xRemoveWhere(selector: (arg: T) => boolean): void;
    xGetRange(index: number, length?: number | undefined): T[];
    xInsert(index: number, item: T): void;
    xInsertRange(index: number, items: T[]): void;
    xFirstOrNull(selector?: (arg: T) => boolean): T | null;
    xFirst(selector?: (arg: T) => boolean): T;
    xLastOrNull(selector?: (arg: T) => boolean): T | null;
    xLast(selector?: (arg: T) => boolean): T;
    xSkip(countToSkip: number): T[];
    xTake(countToTake: number): T[];
    xContains(obj: T): boolean;
    xDistinct(): T[];
    xExcept(except: T[]): T[];
    xClone(): T[];
    xIntersect(anotherArray: T[]): T[];
    xToMap<TKey>(keySelector: (item: T) => TKey, distinctItems?: boolean): Map<TKey, T[]>;
    xReset(): void;
    xEnsureObserver(observer: (changedArray: Array<T>, added: Array<T>, removed: Array<T>) => void): void;
    xRemoveObserver(observer: (changedArray: Array<T>, added: Array<T>, removed: Array<T>) => void): void;
}
//# sourceMappingURL=Array.types.d.ts.map