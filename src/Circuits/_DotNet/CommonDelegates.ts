export interface Func<T,TOut>
{
    (obj:T):TOut;
}
export interface Action<T>
{
    (obj:T):void;
}


export interface Func2<T1, T2, TOut>
{
    (p1:T1, p2:T2):TOut;
}
export interface Action2<T1, T2>
{
    (p1:T1, p2:T2):void;
}


export interface Func3<T1, T2, T3, TOut>
{
    (p1:T1, p2:T2, p3:T3):TOut;
}
export interface Action3<T1, T2, T3>
{
    (p1:T1, p2:T2, p3:T3):void;
}


export interface Func4<T1, T2, T3, T4, TOut>
{
    (p1:T1, p2:T2, p3:T3, p4:T4):TOut;
}
export interface Action4<T1, T2, T3, T4>
{
    (p1:T1, p2:T2, p3:T3, p4:T4):void;
}


export interface Func5<T1, T2, T3, T4, T5, TOut>
{
    (p1:T1, p2:T2, p3:T3, p4:T4, p5:T5):TOut;
}
export interface Action5<T1, T2, T3, T4, T5>
{
    (p1:T1, p2:T2, p3:T3, p4:T4, p5:T5):void;
}

