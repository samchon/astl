export namespace CMath
{
    export function min<T>(x: T, y: T): T
    {
        return x < y ? x: y;
    }

    export function max<T>(x: T, y: T): T
    {
        return x > y ? x : y;
    }
}