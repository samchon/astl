import { IContainer } from "./IContainer";
import { ILinearContainer, ILinearContainerIterator, ILinearContainerReverseIterator } from "./ILinearContainer";

export declare interface IArrayContainer<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends IArrayContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends IArrayContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends IArrayContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends ILinearContainer<T, SourceT, IteratorT, ReverseT, InputT>
{
    nth(index: usize): IteratorT;
    at(index: usize): T;
    set(index: usize, value: T): void;
}

export interface IArrayContainerIterator<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends IArrayContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends IArrayContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends IArrayContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends ILinearContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>
{
    index(): usize;
    advance(n: isize): IteratorT;
}

export interface IArrayContainerReverseIterator<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends IArrayContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends IArrayContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends IArrayContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends ILinearContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>
{
    index(): usize;
    advance(n: isize): ReverseT;
}