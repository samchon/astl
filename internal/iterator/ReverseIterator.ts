import { IContainer } from "../../base/container/IContainer";

export abstract class ReverseIterator<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    implements IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    protected readonly base_: IteratorT;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(base: IteratorT)
    {
        this.base_ = base;
    }

    protected abstract _Create_neighbor(base: IteratorT): ReverseT;

    public prev(): ReverseT
    {
        return this._Create_neighbor(this.base().next());
    }

    public next(): ReverseT
    {
        return this._Create_neighbor(this.base_);
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    public source(): SourceT
    {
        return this.base_.source();
    }

    public base(): IteratorT
    {
        return this.base_.next();
    }

    public abstract get value(): T;

    public equals(obj: ReverseT): boolean
    {
        return this.base() == obj.base();
    }
}