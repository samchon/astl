import { IForwardIterator } from "./IForwardIterator";
import { IRandomAccessIterator } from "./IRandomAccessIterator";

export function advance<InputIterator extends IForwardIterator<any, InputIterator>>
    (it: InputIterator, n: isize): InputIterator
{
    while (n-- > 0)
        it = it.next();
    return it;
}

export function distance<IteratorT extends IForwardIterator<any, IteratorT>>
    (first: IteratorT, last: IteratorT): isize
{
    let ret: isize = 0;
    for (; first != last; first = first.next())
        ++ret;
    return ret;
}