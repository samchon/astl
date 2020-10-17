import { IBidirectionalIterator } from "./IBidirectionalIterator";

export interface IRandomAccessIterator<T, Iterator extends IRandomAccessIterator<T, Iterator> = IRandomAccessIterator<T, any>>
    extends IBidirectionalIterator<T, Iterator>
{
    index(): usize;
    advance(n: isize): Iterator;
}