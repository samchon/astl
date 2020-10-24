import { IBidirectionalIterator } from "./IBidirectionalIterator";
import { IReverseIterator } from "./IReverseIterator";

export declare interface IReversableIterator<T,
        IteratorT extends IReversableIterator<T, IteratorT, ReverseT>,
        ReverseT extends IReverseIterator<T, IteratorT, ReverseT>>
    extends IBidirectionalIterator<T, IteratorT>
{
    reverse(): ReverseT;
}