import { IContainer } from "./IContainer";
import { ILinearContainer } from "./ILinearContainer";

export declare interface IArrayContainer<T extends ElemT, 
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends IArrayContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends IArrayContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends ILinearContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    nth(index: usize): IteratorT;
    at(index: usize): T;
    set(index: usize, value: T): void;
}

export declare namespace IArrayContainer
{
    export interface Iterator<T extends ElemT, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        extends ILinearContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
    {
        index(): usize;
        advance(n: isize): IteratorT;
    }

    export interface ReverseIterator<T extends ElemT, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
            ElemT>
        extends ILinearContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
    {
        index(): usize;
        advance(n: isize): ReverseT;
    }
}