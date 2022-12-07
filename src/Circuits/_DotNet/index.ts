import './String/String.impl';
import './Array/Array.impl';
import './Map/Map.impl';

export { DateTime } from './DateTime/DateTime';
export { TimeSpan } from './DateTime/TimeSpan';
export { WeekDay } from './DateTime/WeekDay';
export { DateFormat } from './DateTime/DateFormat';
export { TypeInfo } from './Type/TypeInfo';
export { Guid } from './Guid/Guid';

export class CancellationToken
{
    private _id!: NodeJS.Timeout;
    private _resolve?: Function;
    isCancellationRequested = false;
    cancel()
    {
        this.isCancellationRequested = true;
        clearTimeout(this._id);
        if(this._resolve) this._resolve();
    }
}

export async function waitAsync(ms: number, cancellationToken?: CancellationToken): Promise<void>
{
    return new Promise<void>((resolve, reject)=>
    {
        const timeOutId = setTimeout(resolve, ms);
        if(cancellationToken)
        {
            // @ts-ignore
            cancellationToken._resolve = resolve;
            // @ts-ignore
            cancellationToken._id = timeOutId
        }
    });
}

export function isPrimitive(obj: any)
{
    if(obj == null) { return true; }
    return new Object(obj) !== obj;
}

export type Constructor<T = object> = new (...args: any[]) => T;

export * from './Exceptions/Exceptions';
