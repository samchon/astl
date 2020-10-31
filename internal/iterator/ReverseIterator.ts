import { IContainer, IContainerIterator, IContainerReverseIterator } from "../container/linear/IContainer";

export abstract class ReverseIterator<T extends InputT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        IteratorT extends IContainerIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>, 
        ReverseT extends IContainerReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        InputT>
{
    protected readonly base_: IteratorT;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(base: IteratorT)
    {
        this.base_ = base.prev();
    }

    @inline()
    public prev(): ReverseT
    {
        return this.base().next().reverse();
    }

    @inline()
    public next(): ReverseT
    {
        return this.base_.reverse();
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public source(): SourceT
    {
        return this.base_.source();
    }

    @inline()
    public base(): IteratorT
    {
        return this.base_.next();
    }

    public abstract get value(): T;

    @inline()
    public equals(obj: ReverseT): boolean
    {
        return this.base() == obj.base();
    }
}