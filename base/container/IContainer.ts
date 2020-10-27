import { IReversableIterator } from "../../iterator/IReversableIterator";
import { IReverseIterator } from "../../iterator/IReverseIterator";

export declare interface IContainer<T extends PElem, 
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
        IteratorT extends IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
        PElem>
{
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    clear(): void;

    erase(it: IteratorT): IteratorT;
    erase(first: IteratorT, last: IteratorT): IteratorT;

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

export declare namespace IContainer
{
    export interface Iterator<T extends PElem, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            PElem>
        extends IReversableIterator<T, IteratorT, ReverseT>
    {
        source(): SourceT;
        reverse(): ReverseT;
    }

    export interface ReverseIterator<T extends PElem, 
            SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            IteratorT extends Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            ReverseT extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, PElem>,
            PElem>
        extends IReverseIterator<T, IteratorT, ReverseT>
    {
        source(): SourceT;
    }
}