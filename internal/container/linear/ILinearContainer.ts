import { IContainer, IContainerIterator, IContainerReverseIterator } from "./IContainer";
import { IForwardIterator } from "../../../iterator/IForwardIterator";

export declare interface ILinearContainer<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends ILinearContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends ILinearContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends ILinearContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>
{
    resize(n: usize): void;

    push_back(val: T): void;
    pop_back(): void;

    insert(pos: IteratorT, val: T): IteratorT;
    insert_repeatedly(pos: IteratorT, n: usize, val: T): IteratorT;
    insert_range<InputIterator>
        (pos: IteratorT, first: InputIterator, last: InputIterator): IteratorT;

    back(): T;
}

export interface ILinearContainerIterator<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends ILinearContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends ILinearContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends ILinearContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>
{
}

export interface ILinearContainerReverseIterator<T extends InputT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends ILinearContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends ILinearContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>, 
        ReverseT extends ILinearContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>
{
}