import { IPointer } from "../functional/IPointer";

export interface IForwardIterator<T, Iterator extends IForwardIterator<T, Iterator>>
    extends IPointer<T>
{
    next(): Iterator;
}