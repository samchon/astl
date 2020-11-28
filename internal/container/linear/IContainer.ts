import { IReversableIterator } from "../../../iterator/IReversableIterator";
import { IReverseIterator } from "../../../iterator/IReverseIterator";

export declare interface IContainer<T extends PElem, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        // ContainerT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        IteratorT extends IContainerIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        ReverseT extends IContainerReverseIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        PElem>
{
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    clear(): void;
    erase(first: IteratorT, last?: IteratorT): IteratorT;

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    size(): usize;
    empty(): boolean;

    begin(): IteratorT;
    end(): IteratorT;
    rbegin(): ReverseT;
    rend(): ReverseT;
}

export interface IContainerIterator<T extends PElem, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        // ContainerT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        IteratorT extends IContainerIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        ReverseT extends IContainerReverseIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        PElem>
    extends IReversableIterator<T, IteratorT, ReverseT>
{
    source(): SourceT;
    reverse(): ReverseT;
}

export interface IContainerReverseIterator<T extends PElem, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        // ContainerT extends IContainer<T, SourceT, IteratorT, ReverseT, PElem>,
        IteratorT extends IContainerIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        ReverseT extends IContainerReverseIterator<T, SourceT, IteratorT, ReverseT, PElem>,
        PElem>
    extends IReverseIterator<T, IteratorT, ReverseT>
{
    source(): SourceT;
}