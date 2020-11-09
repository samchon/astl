export interface IForwardIterator<T, Iterator extends IForwardIterator<T, Iterator>>
{
    value: T;
    next(): Iterator;
}