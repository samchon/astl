import { IForwardIterator } from "./IForwardIterator";

export declare interface IBidirectionalIterator<T, Iterator extends IBidirectionalIterator<T, Iterator> = IBidirectionalIterator<T, any>>
    extends IForwardIterator<T, Iterator>
{
    prev(): Iterator;
}