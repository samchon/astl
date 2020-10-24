import { IBidirectionalIterator } from "./IBidirectionalIterator";
import { IReversableIterator } from "./IReversableIterator";

export declare interface IReverseIterator<T,
        Base extends IReversableIterator<T, Base, This>,
        This extends IReverseIterator<T, Base, This>>
    extends IBidirectionalIterator<T, This>
{
    base(): Base;
}
