import { IPointer } from "../../functional/IPointer";
import { IForwardIterator } from "../../iterator/IForwardIterator";

export declare interface IForwardContainer<Iterator extends IForwardIterator<IPointer.ValueType<Iterator>, Iterator>>
{
    begin(): Iterator;
    end(): Iterator;
}