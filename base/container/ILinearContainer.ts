import { IContainer } from "./IContainer";

import { IForwardIterator } from "../../iterator/IForwardIterator";

export declare interface ILinearContainer<T extends ElemT, 
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends ILinearContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ILinearContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends ILinearContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    resize(n: usize): void;

    push_back(val: T): void;
    pop_back(): void;

    insert(pos: IteratorT, val: T): IteratorT;
    insert_repeatedly(pos: IteratorT, n: usize, val: T): IteratorT;
    insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: IteratorT, first: InputIterator, last: InputIterator): IteratorT;

    back(): T;
}

export declare namespace ILinearContainer
{
    export type Iterator<T extends ElemT, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ILinearContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        = IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>;

    export type ReverseIterator<T extends ElemT, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends ILinearContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        = IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>;
}