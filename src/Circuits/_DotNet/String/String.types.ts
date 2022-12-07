// @ts-ignore
interface String
{
    xPadRight(totalWidth: number, paddingChar: string): string;

    xPadLeft(totalWidth: number, paddingChar: string): string;

    xSubstring(startIndex: number, length?: number): string;

    xRepeat(totalWidth: number, paddingChar: string): string;

    xRemove(startIndex: number, length: number): string;

    xContains(substr: string): boolean;

    xInsert(index: number, value: string): string;

    xToString(): string;

    xStartsWith(str: string): boolean;

    xEndsWith(str: string): boolean;

    xIndexOf(subStr:string, startSearchFromIndex?:number): number;

    xLastIndexOf(subStr:string, startSearchFromIndex?:number): number;

    xReplaceFirstOccurence(toReplace: string, replacement: string): string;

    xReplaceAll(toReplace: string, replacement: string): string;

    get xLength(): number;
}

interface StringConstructor
{
    xJoin(separator:string, parts:string[]|string): string;

    xIsNullOrWhiteSpace(value: string): boolean;

    xIsNullOrEmpty(value: string): boolean;

    xFromBase64(value: string): string;

    xToBase64(value: string): string;
}
