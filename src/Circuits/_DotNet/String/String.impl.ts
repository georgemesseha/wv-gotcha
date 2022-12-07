import { Exception } from '../Exceptions/Exceptions'
import { Exception_ArgumentInvalid, Exception_ArgumentNull } from '../Exceptions/Exceptions'
import './String.types'

//let XString = require("./XString").XString
let proto:any = String.prototype

Object.defineProperty(proto, 'xLength', 
{
    get: function()
    {
        return this.length;
    }
});

proto.xPadRight = function (totalWidth: number, paddingChar: string): string
{
    if (paddingChar.length != 1)
        throw new Exception_ArgumentInvalid('paddingChar', paddingChar, "Only one character expected as a paddingChar");

   return this.padEnd(totalWidth);
}

proto.xRepeat = function(count:number)
{
    if(Math.round(count) !== count )
        throw new Exception_ArgumentInvalid('count', 'count must be an integer');

    return this.repeat(count);
};

proto.xPadLeft = function(totalWidth: number, paddingChar: string): string
{
    if (paddingChar.length != 1)
        throw new Exception_ArgumentInvalid('paddingChar', paddingChar, "Only one character expected as a paddingChar");

   return this.padStart(totalWidth);
};

proto.xSubstring = function(startIndex: number, length?: number): string
{
    if (startIndex >= this.length)
            throw new Exception_ArgumentInvalid('startIndex', startIndex, 'index out of range');

    if(!length)
    {
        length = this.length - startIndex;
    }
    else
    {
        if (startIndex + length > this.length)
            throw new Exception_ArgumentInvalid('length', length, "length out of range");
    }

    let lastIndex = startIndex + length;
    return this.slice(startIndex, lastIndex);
}

proto.xRemove = function(startIndex: number, length: number): string
{
    if (length <= 0)
        throw new Exception_ArgumentInvalid('length', length, "Invalid argument length");

    if (startIndex + length - 1 > this.Length)
        throw new Error("Out of range.");
        
    let leftPart = this.xSubstring(0, startIndex);
    let rightPart = this.xSubstring(startIndex + length, this.Length - startIndex - length);
    return `${leftPart}${rightPart}`;
}

proto.xContains = function(substr: string): boolean
{
    if(substr == null || substr == "")
        throw new Exception_ArgumentInvalid('substr', substr, "substr cannot be null or empty");

    return this.includes(substr, 0);
}

proto.xInsert = function(index: number, value: string): string
{
    if(Math.round(index) !== index )
        throw new Exception_ArgumentInvalid('index', 'index must be an integer');
    if (index < 0 || index >= this.Value.length) 
        throw new Exception_ArgumentInvalid('index', 'Out of range');


    return `${this.xSubstring(0, index)}${value}${this.xSubstring(index)}`;
}

proto.xStartsWith = function(str: string): boolean
{
    return this.startsWith(str);
}

proto.xEndsWith = function(str: string)
{
    return this.endsWith(str);
}

proto.xIndexOf = function(subStr:string, startSearchFromIndex:number): number
{
    if(!startSearchFromIndex)
    startSearchFromIndex = 0;

    if(subStr == null)
        throw new Exception("subStr cannot be null");

    if(startSearchFromIndex < 0 || startSearchFromIndex >= subStr.length)
        throw new Exception("Index out of range");

    if(Math.round(startSearchFromIndex) !== startSearchFromIndex )
        throw new Exception_ArgumentInvalid('startSearchFromIndex', 'startSearchFromIndex must be an integer');

    return this.indexOf(subStr, startSearchFromIndex)
}

proto.xLastIndexOf = function(subStr:string, startSearchFromIndex:number): number
{
    if(subStr == null)
        throw new Exception_ArgumentNull("subStr");

    return this.lastIndexOf(subStr);
}

proto.xReplaceFirstOccurence = function(toReplace: string, replacement: string): string
{
    return this.replace(toReplace, replacement);
}

proto.xReplaceAll = function(toReplace: string, replaceWith: string): string
{
    if(toReplace === replaceWith) return this;

    let output = this;
    while(output.indexOf(toReplace) >= 0)
    {
        output = output.replace(toReplace, replaceWith);
    }

    return output;
}

proto.xToString = function()
{
    return this;
}

let protoConstructor:any = String
protoConstructor.xJoin = function(parts:string[], separator:string|undefined = undefined): string
{
    if(parts.length == 0) return '';
    return parts.join(separator);
}

protoConstructor.xIsNullOrWhiteSpace = function(value: string)
{
    return value == null || new RegExp(/^\s*$/g).test(value);
}

protoConstructor.xIsNullOrEmpty = function(value: string)
{
    return value == null || value === '';
}

protoConstructor.xFromBase64 = function(value: string): string
{
    return atob(value);
}

protoConstructor.xToBase64 = function(value: string): string
{
    return btoa(value);
}