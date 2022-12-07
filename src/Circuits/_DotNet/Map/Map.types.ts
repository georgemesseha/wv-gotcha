// @ts-ignore
interface Map<K, V>
{
    xAdd(key: K, value: V): void;

    xEnsure(key: K, value: V, overwriteIfExising: boolean): V;

    xGet(key: K): V | undefined;

    xSet(key: K, value: V): void;

    xUpdateOnlyIfAny(key: K, value: V): boolean;

    xRemove(key: K): void;

    xEnsureRemoved(key: K) : boolean;

    xKeys(): K[];

    xValues(): V[];

    xClear(): void;

    xForeach(func: (key: K) => void): void;

    xContainsKey(key: K): boolean;

    xCount(): number;

    xClone(): Map<K, V>;

    xAny(): boolean;
}

// @ts-ignore
let protoConstructor: any = Map;
interface MapConstructor
{
    FromObjectProps<TValue>(obj: object): Map<string, TValue>
}
