import { IPointer } from "../../../functional/IPointer";
import { IForwardIterator } from "../../../iterator/IForwardIterator";

export declare interface IInsert<Iterator extends IForwardIterator<IPointer.ValueType<Iterator>, Iterator>>
{
    insert(it: Iterator, value: IPointer.ValueType<Iterator>): Iterator;
}