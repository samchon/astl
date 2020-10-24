import { IContainer } from "../../base/container/IContainer";
import { IArrayContainer } from "../../base/container/IArrayContainer";

import { ArrayIterator } from "./ArrayIterator";
import { ReverseIterator } from "./ReverseIterator";

export abstract class ArrayReverseIterator<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ArrayIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends ArrayReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
    implements IArrayContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    public advance(n: isize): ReverseT
    {
        return this._Create_neighbor(this.base().advance(-n));
    }

    public index(): usize
    {
        return this.base().index();
    }
    
    public abstract get value(): T;
}