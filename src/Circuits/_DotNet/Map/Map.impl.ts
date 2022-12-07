import './Map.types'

import { Dictionary } from "./Dictionary";

let proto:any = Map.prototype

type K = {}
type V = {}

proto.xAdd = function(key:K, value:V):void
{
    new Dictionary<K, V>(this).Add(key, value)
}

proto.xEnsure = function(key:K, value:V, overwriteIfExising: boolean = false): V
{
    return new Dictionary<K, V>(this).Ensure(key, value, overwriteIfExising)
}

proto.xGet = function(key: K): V|undefined
{
    return new Dictionary<K, V>(this).Get(key)
}

proto.xSet = function(key: K, value:V): void
{
    new Dictionary<K, V>(this).Set(key, value)
}

proto.xUpdateOnlyIfAny = function(key: K, value:V): boolean
{
    return new Dictionary<K, V>(this).UpdateOnlyIfAny(key, value)
}

proto.xRemove = function(key:K): void
{
    return new Dictionary<K, V>(this).Remove(key)
}

proto.xEnsureRemoved = function(key:K) :  boolean
{
    return new Dictionary<K, V>(this).EnsureRemoved(key)
}

proto.xKeys = function(): K[]
{
    return new Dictionary<K, V>(this).Keys.Array
}

proto.xValues = function(): V[]
{
    return new Dictionary<K, V>(this).Values.Array
}

proto.xClear = function(): void
{
    new Dictionary<K, V>(this).Clear()
}

proto.xForeach = function(func: (key:K)=>void): void
{
    new Dictionary<K, V>(this).Foreach(func)
}

proto.xContainsKey = function(key:K): boolean
{
    return new Dictionary<K, V>(this).Contains(key)
}

proto.xClone = function(): Map<K,V>
{
    const clone = new Map();
    this.forEach((v:K, k:V)=>
    {
        clone.set(k, v);
    });
    return clone;
}

proto.xCount = function(): number
{
    return new Dictionary<K, V>(this).Count 

}

proto.xAny = function(): boolean
{
    return this.size > 0;
}

let protoConstructor:any = Map
protoConstructor.FromObjectProps = function<TValue>(obj: object): Map<string, TValue>
{
    return Dictionary.FromObjectProps(obj)._map as Map<string, TValue>;
}