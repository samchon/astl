import { IForwardContainer } from "./IForwardContainer";
import { IPointer } from "../../functional/IPointer";
import { IRandomAccessIterator } from "../../iterator/IRandomAccessIterator";

export declare interface IRandomAccessContainer<IteratorT extends IRandomAccessIterator<IPointer.ValueType<IteratorT>, IteratorT>>
    extends IForwardContainer<IteratorT>
{
    nth(index: usize): IteratorT;
}