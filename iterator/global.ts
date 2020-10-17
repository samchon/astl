import { IForwardIterator } from "./IForwardIterator";
import { IRandomAccessIterator } from "./IRandomAccessIterator";

export function distance<Iterator extends IForwardIterator<any, Iterator>>
    (first: Iterator, last: Iterator): isize
{
    if ((<any>first as IRandomAccessIterator<any, any>).index !== undefined)
        return distance_via_index(<any>first, last);

    let ret: isize = 0;
    for (; first != last; first = first.next())
        ++ret;
    return ret;
}

function distance_via_index<RandomAccessIterator extends IRandomAccessIterator<any, RandomAccessIterator>>
    (first: RandomAccessIterator, last: RandomAccessIterator): isize
{
    const x: isize = <isize>first.index();
    const y: isize = <isize>last.index();

    return x - y;
}