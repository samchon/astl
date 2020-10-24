import { IForwardContainer } from "./IForwardContainer";
import { IPointer } from "../../functional/IPointer";
import { IReversableIterator } from "../../iterator/IReversableIterator";
import { IReverseIterator } from "../../iterator/IReverseIterator";

export declare interface IBidirectionalContainer< 
        IteratorT extends IReversableIterator<IPointer.ValueType<IteratorT>, IteratorT, ReverseIteratorT>,
        ReverseIteratorT extends IReverseIterator<IPointer.ValueType<IteratorT>, IteratorT, ReverseIteratorT>>
    extends IForwardContainer<IteratorT>
{
    rbegin(): ReverseIteratorT;
    rend(): ReverseIteratorT;
}