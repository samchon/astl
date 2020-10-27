import { IContainer } from "../../base/container/IContainer";
import { ListContainer } from "../container/linear/ListContainer";

import { IReversableIterator } from "../../iterator/IReversableIterator";
import { ListReverseIterator } from "./ListReverseIterator";

export abstract class ListIterator<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    implements IReversableIterator<T, IteratorT, ReverseT>
{
    private prev_: IteratorT;
    private next_: IteratorT;
    private erased_: boolean;

    protected value_: T | undefined;

    public constructor(prev?: IteratorT, next?: IteratorT, value?: T)
    {
        this.prev_ = prev ? prev : <object>this as IteratorT;
        this.next_ = next ? next : <object>this as IteratorT;
        this.erased_ = false;

        this.value_ = value;
    }

    public abstract reverse(): ReverseT;

    /* ---------------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------------- */
    public abstract source(): SourceT;

    public prev(): IteratorT
    {
        return this.prev_;
    }

    public next(): IteratorT
    {
        return this.next_;
    }

    public abstract get value(): T;

    /* ---------------------------------------------------------------
        HIDDEN METHODS
    --------------------------------------------------------------- */
    @inline()
    public static _Set_prev<T extends ElemT,
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        (it: IteratorT, prev: IteratorT): void
    {
        it.prev_ = prev;
    }

    @inline()
    public static _Set_next<T extends ElemT,
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        (it: IteratorT, next: IteratorT): void
    {
        it.next_ = next;
    }

    public static _Is_erased<T extends ElemT,
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        (it: IteratorT): boolean
    {
        return it.erased_;
    }

    public static _Set_erased<T extends ElemT,
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        (it: IteratorT): void
    {
        it.erased_ = true;
    }
}