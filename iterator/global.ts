import { IForwardIterator } from "./IForwardIterator";

export function distance<Iterator extends IForwardIterator<any, Iterator>>
    (first: Iterator, last: Iterator): usize
{
    let ret: usize = 0;
    for (; first != last; first = first.next())
        ++ret;
    return ret;
}