import { IPointer } from "../functional/IPointer";

export declare interface IForwardIterator<T, Iterator extends IForwardIterator<T, Iterator>>
    extends IPointer<T>
{
    next(): Iterator;
}