import { IContainer } from "../container/linear/IContainer";
import { IArrayContainer } from "../container/linear/IArrayContainer";

import { ArrayReverseIterator } from "./ArrayReverseIterator";

export abstract class ArrayIterator<T extends InputT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        IteratorT extends ArrayIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>, 
        ReverseT extends ArrayReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        InputT>
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

    @inline()
    public prev(): IteratorT
    {
        return this.advance(-1);
    }

    @inline()
    public next(): IteratorT
    {
        return this.advance(1);
    }

    @inline()
    public advance(n: isize): IteratorT
    {
        return this.container_.nth(this.index_ + n);
    }

    /* ---------------------------------------------------------
        ACCCESSORS
    --------------------------------------------------------- */
    public abstract source(): SourceT;

    @inline()
    public index(): usize
    {
        return this.index_;
    }

    public abstract get value(): T;

    @operator("==")
    @inline()
    public equals(obj: IteratorT): boolean
    {
        return this.container_ == obj.container_ 
            && this.index_ === obj.index_;
    }

    @operator("!=")
    @inline()
    public _not_equals(obj: IteratorT): boolean
    {
        return !this.equals(obj);
    }
}