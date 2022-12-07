import { List } from "../Array/List";
import { DateFormat } from "./DateFormat";
import { WeekDay } from "./WeekDay";
import { TimeSpan } from "./TimeSpan";
//import { Conv } from "./Conv";


export class DateTime 
{
    public get Ticks(): number
    {
        return this._Ticks;
    }

    constructor(private _Ticks: number = 0)
    {
        if(_Ticks > 864000000000000)
            throw new Error('Value exceeds DateTime.Max.');
        if(_Ticks < 0)
            throw new Error('Value is less than DateTime.Min');

        this.valueOf = () => this.Ticks;
    }

    public toString(): string
    {
        return `${this.Year}-${this.Month}-${this.DayOfMonth} ${this.Hour}:${this.Minute}:${this.Second}.${this.MilliSecond}`;
    }

    public get ToString(): string
    {
        return this.toString();
    }

    public static get Min(): DateTime
    {
        return new DateTime(0);
    }

    public static get Max()
    {
        return new DateTime(864000000000000);
    }

    public static get Now(): DateTime
    {
        return new DateTime(Date.now().valueOf()); 
    }

    public AsLocalToUtc(): DateTime
    {
        let utc:number = new Date(2020, 0, 1).valueOf();

        // this is funckinly meant to be the local time of the UTC 2020-01-01 by the fucken javascript
        let local:number = Date.UTC(2020, 0, 1).valueOf();

        return new DateTime(this._Ticks - (local - utc));
    }

    public AsUtcToLocal(): DateTime
    {
        let utc = new Date(2020, 0, 1).valueOf();

        // this is funckinly meant to be the local time of the UTC 2020-01-01 by the fucken javascript
        let local = Date.UTC(2020, 0, 1).valueOf();

        return new DateTime(this._Ticks - (utc - local));
    }

    public static TryParse(text: string, 
                           refResult:{Result:DateTime, ErrorMessage:string},
                           format: DateFormat = DateFormat.yyyy_MM_dd): boolean
    {
        text = text.trim();
        let parts: List<string> = new List<string>(text.split(/\s*\D\s*/)); 
        if(new List<number>([3,6,7]).Contains(parts.Count) === false
         || parts.Any(p=>/\D/.test(p)))
        {
            if(refResult != null)
            {
                refResult.ErrorMessage = "Invalid DateTime format. Valid formats should satisfy the following two conditions: (1) it should be composed of [3, 5, 6, or 7] parts. 3 parts for date only, 6 parts for date and time excluding millisec part, and 7 prats for the whole date and time including the milliseconds part. (2) Parts separators could be any single non-digit characters while extra spaces arround are not significant. (It's not required to have a consistent use of the single separator)"; 
            }

            return false;
        }
        else
        {
            let numParts = parts.Select<number>(sp=>new Number(sp).valueOf()).Array;
            let year=0, month=0, day=0, hour=0, minute=0, sec=0, milliSec=0;
            switch(format)
            {
                case DateFormat.yyyy_MM_dd:
                    year = numParts[0];
                    month = numParts[1];
                    day = numParts[2];
                    break;
                case DateFormat.MM_dd_yyyy:
                    year = numParts[2];
                    month = numParts[0];
                    day = numParts[1];
                    break;
                case DateFormat.dd_MM_yyy:
                    year = numParts[2];
                    month = numParts[1];
                    day = numParts[0];
                    break;
            }
            hour        = (numParts.length > 3)? numParts[3] : 0; 
            minute      = (numParts.length > 4)? numParts[4] : 0; 
            sec         = (numParts.length > 5)? numParts[5] : 0; 
            milliSec    = (numParts.length > 6)? numParts[6] : 0; 
           
            try
            {
                let ticks = Date.parse(`${year}-${month}-${day} ${hour}:${minute}:${sec}.${milliSec}`);
                let fuckenJsDate = new DateTime(ticks);
                if(fuckenJsDate.MilliSecond !== milliSec) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong millisecond part: ${milliSec}`;
                    return false;
                }
                if(fuckenJsDate.Second !== sec) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong second part: ${sec}`;
                    return false;
                }
                else if(fuckenJsDate.Minute !== minute) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong minute part: ${minute}`;
                    return false;
                }
                else if(fuckenJsDate.Hour !== hour) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong hour part: ${hour}`;
                    return false;
                }
                else if(fuckenJsDate.DayOfMonth !== day) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong hour part: ${day}`;
                    return false;
                }
                else if(fuckenJsDate.Month !== month) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong month part: ${month}`;
                    return false;
                }
                else if(fuckenJsDate.Year !== year) // means it rolled over
                {
                    refResult.ErrorMessage = `Wrong year part: ${year}`;
                    return false;
                }
            }
            catch(er)
            {
                refResult.ErrorMessage = (er as object).toString(); 
                return false;
            }
            
            if(refResult != null)
            {
                refResult.ErrorMessage = "";
                refResult.Result = new DateTime(Date.parse(`${year}-${month}-${day} ${hour}:${minute}:${sec}.${milliSec}`));
            }

            return true;
        }
    }

    /**
     * Valid formats should satisfy the following two conditions: (1) it should be composed of [3, 5, 6, or 7] parts. 3 parts for date only, 6 parts for date and time excluding millisec part, and 7 prats for the whole date and time parts including the milliseconds part. (2) Parts separators could be either one or more spaces or any non-digit character preceded or succeeded by zero or more white spaces.
     * @param dateTimeInText A text representation of a DateTime
     * @param The date time format to parse against.
     */
    public static Parse(dateTimeInText: string, format:DateFormat=DateFormat.yyyy_MM_dd): DateTime
    {
       let refResult={Result:DateTime.Min, ErrorMessage:"null"};

       //let refResult = {Result:null, ErrorMessage:null};
       if(DateTime.TryParse(dateTimeInText, refResult, format))
       {
           return refResult.Result;
       }
       else
       {        
           throw new Error(refResult.ErrorMessage as string);
       }
    }

    
    public get Year(): number
    {
        return new Date(this.Ticks).getFullYear();
    }
    public get Month(): number
    {
        return new Date(this.Ticks).getMonth() + 1;
    }
    public get DayOfMonth(): number
    {
        return new Date(this.Ticks).getDate();
    }
    public get DayOfWeek(): WeekDay
    {
        let dayOfWeek = new Date(this.Ticks).getDay();
        return Object.getPrototypeOf(WeekDay)[dayOfWeek]; 
    }
    public get Hour(): number
    {
        return new Date(this.Ticks).getHours();
    }
    public get Minute(): number
    {
        return new Date(this.Ticks).getMinutes();
    }
    public get Second(): number
    {
        return new Date(this.Ticks).getSeconds();
    }
    public get MilliSecond(): number
    {
        return new Date(this.Ticks).getMilliseconds();
    }

    public AddDays(daysToAdd:number)
    {
        return new DateTime(this.Ticks + daysToAdd * 24 * 60 * 60 * 1000);
    }

    public AddHours(hoursToAdd: number)
    {
        return new DateTime(this.Ticks + hoursToAdd * 60 * 60 * 1000);
    }

    public AddMinutes(minutesToAdd: number)
    {
        return new DateTime(this.Ticks + minutesToAdd * 60 * 1000);
    }

    public AddSeconds(secondsToAdd: number)
    {
        return new DateTime(this.Ticks + secondsToAdd * 1000);
    }

    public AddMilliseconds(millisecondsToAdd: number)
    {
        return new DateTime(this.Ticks + millisecondsToAdd);
    }

    public Compare(otherDateTime: DateTime)
    {
        return this > otherDateTime ? 1 : (this < otherDateTime ? -1 : 0);
    }

    public get Date(): DateTime
    {
        return DateTime.Parse(`${this.Year}-${this.Month}-${this.DayOfMonth}`);
    }

    public SubtractDate(another: DateTime): TimeSpan
    {
        return new TimeSpan(this.Ticks - another.Ticks);
    }
    public SubtractSpan(timeSpan: TimeSpan): DateTime
    {
        return new DateTime(this.Ticks - timeSpan.ticks);
    }

    public Equals(another:DateTime)
    {
        return this.Ticks === another.Ticks;
    }

    public get TimeOfDay(): TimeSpan
    {
        return new TimeSpan(this.Ticks - this.Date.Ticks);
    }
}
