import { IContainer } from "../../base/container/IContainer";
import { IArrayContainer } from "../../base/container/IArrayContainer";

import { ArrayReverseIterator } from "./ArrayReverseIterator";

export abstract class ArrayIterator<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ArrayIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends ArrayReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    implements IArrayContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    protected readonly container_: ContainerT;
    protected readonly index_: usize;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(container: ContainerT, index: usize)
    {
        this.container_ = container;
        this.index_ = index;
    }

    public abstract reverse(): ReverseT;

    public prev(): IteratorT
    {
        return this.advance(-1);
    }

    public next(): IteratorT
    {
        return this.advance(1);
    }

    public advance(n: isize): IteratorT
    {
        return this.container_.nth(this.index_ + n);
    }

    /* ---------------------------------------------------------
        ACCCESSORS
    --------------------------------------------------------- */
    public abstract source(): SourceT;

    public index(): usize
    {
        return this.index_;
    }

    public abstract get value(): T;

    public equals(obj: IteratorT): boolean
    {
        return this.container_ == obj.container_ 
            && this.index_ === obj.index_;
    }
}