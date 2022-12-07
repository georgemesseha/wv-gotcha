import { Conv } from "./Conv";
import { List } from "../Array/List";

export class TimeSpan
{
    constructor(private _ticks:number)
    {
        
    }
   
    public static parse(text: string): TimeSpan
    {
        text = text.trim();
        let parts: List<string> = new List<string>(text.split(/\s*\D\s*/)); 
        if((parts.Count<1 || parts.Count>5) || parts.Any(p=>/\D/.test(p)))
        {
            throw new Error("Invalid TimeSpan format. Valid formats should satisfy the following two conditions: (1) it should be composed of from 1 to 5 parts, starting from days through to milliseconds. (2) Parts separators could be any single non-digit characters while extra spaces arround are not significant (It's not required to have a consistent use of the single separator)."); 
        }

        let numParts = parts.Select<number>(sp=>new Number(sp).valueOf()).Array;
                       
        let day         = numParts[0]; 
        let hour        = (numParts.length > 1)? numParts[1] : 0; 
        let minute      = (numParts.length > 2)? numParts[2] : 0; 
        let sec         = (numParts.length > 3)? numParts[3] : 0; 
        let milliSec    = (numParts.length > 4)? numParts[4] : 0; 
        
        let ticks = (day*Conv.DayTicks)+(hour*Conv.HourTicks)+(minute*Conv.MinuteTicks)+(sec*Conv.SecTicks)+(milliSec);
        return new TimeSpan(ticks); 
    }

    public get ticks():number
    {
        return this._ticks;
        this.valueOf = ()=> this._ticks;
    }
    public get totalSeconds(): number
    {
        return this.ticks / Conv.SecTicks;
    }
    public get totalMinutes(): number
    {
        return this.ticks / Conv.MinuteTicks;
    }
    public get totalHours(): number
    {
        return this.ticks / Conv.HourTicks;
    }
    public get totalDays(): number
    {
        return this.ticks / Conv.DayTicks;
    }

    public get days(): number
    {
        return Math.floor(this.ticks / Conv.DayTicks);
    }
    public get hours(): number
    {
        let ticks = this.ticks % Conv.DayTicks;
        return Math.floor(ticks);
    }
    public get minutes(): number
    {
        let ticks = this.ticks % Conv.HourTicks;
        return Math.floor(ticks);
    }
    public get seconds(): number
    {
        let ticks = this.ticks % Conv.MinuteTicks;
        return Math.floor(ticks);
    }
    public get milliseconds(): number
    {
        let ticks = this.ticks % Conv.SecTicks;
        return Math.floor(ticks);
    }
    
    public static fromMilliSeconds(milliSec:number): TimeSpan
    {
        return new TimeSpan(milliSec);
    }
    public addMilliSeconds(milliSec:number): TimeSpan
    {
        return new TimeSpan(this.ticks + milliSec);
    }

    public static fromSeconds(seconds:number): TimeSpan
    {
        return new TimeSpan(seconds * 1000);
    }
    public addSeconds(seconds:number): TimeSpan
    {
        return new TimeSpan(this.ticks + seconds * 1000);
    }

    public static fromMinutes(minutes:number): TimeSpan
    {
        return new TimeSpan(minutes * 60 * 1000);
    }
    public addMinutes(minutes:number): TimeSpan
    {
        return new TimeSpan(this.ticks + minutes * 60 * 1000);
    }


    public static fromHours(hours:number): TimeSpan
    {
        return new TimeSpan(hours * 60 * 60 * 1000);
    }
    public addHours(hours:number): TimeSpan
    {
        return new TimeSpan(this.ticks + hours * 60 * 60 * 1000);
    }

    public static fromDays(days:number): TimeSpan
    {
        return new TimeSpan(days * 24 * 60 * 60 * 1000);
    }
    public addDays(days:number): TimeSpan
    {
        return new TimeSpan(this.ticks + days * 24 * 60 * 60 * 1000);
    }

    public static fromWeeks(weeks:number): TimeSpan
    {
        return new TimeSpan(weeks * 7 * 24 * 60 * 60 * 1000);
    }
    public addWeeks(weeks:number): TimeSpan
    {
        return new TimeSpan(this.ticks + weeks * 7 * 24 * 60 * 60 * 1000);
    } 

    public absolute():TimeSpan
    {
        return new TimeSpan(Math.abs(this.ticks));
    }

    public negate(): TimeSpan
    {
        return new TimeSpan(-this.ticks);
    }

    public multiply(factor:number): TimeSpan
    {
        return new TimeSpan(this.ticks*factor);
    }

    public subtract(span:TimeSpan): TimeSpan
    {
        return new TimeSpan(this.ticks - span.ticks);
    }

    public compareTo(another: TimeSpan): number
    {
        if(this.ticks > another.ticks) return 1;
        if(this.ticks < another.ticks) return -1;
        return 0;
    }

    public add(span:TimeSpan): TimeSpan
    {
        return new TimeSpan(this.ticks + span.ticks);
    }

    public static get zero()
    {
        return new TimeSpan(0);
    }

    public toString(): string
    {
        return `${this.days} - ${this.hours}:${this.minutes}:${this.seconds}.${this.milliseconds}`;
    }

    public get _(): string
    {
        return this.toString();
    }
}