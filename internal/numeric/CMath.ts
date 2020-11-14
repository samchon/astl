import { Vector } from "../../container/Vector";

export namespace CMath
{
    @inline()
    export function min<T>(x: T, y: T): T
    {
        return x < y ? x: y;
    }

    @inline()
    export function max<T>(x: T, y: T): T
    {
        return x > y ? x : y;
    }

    @inline()
    export function factorial(k: usize): usize
    {
        if (FACTORIALS.size() <= k)
            for (let i: usize = FACTORIALS.size(); i <= k; ++i)
                FACTORIALS.push_back(FACTORIALS.at(i - 1) * i);
        return FACTORIALS.at(k);
    }
    const FACTORIALS: Vector<usize> = new Vector();
}