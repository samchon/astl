import { IContainerIterator, IContainerReverseIterator } from "../linear/IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
// import { Pair } from "../../../utility/Pair";

export interface ISetContainer<Key, 
        Unique extends boolean, 
        SourceT extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>, 
        // ContainerT extends IContainer<Key, SourceT, IteratorT, ReverseT, Key>, 
        IteratorT extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends IAssociativeContainer<Key, Key, SourceT, IteratorT, ReverseT, Key>
{
    // emplace(key: Key): ISetContainerEmplaceRet<Key, Unique, SourceT, IteratorT, ReverseT>;
    insert_hint(hint: IteratorT, key: Key): IteratorT;
    insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void;
}

export interface ISetContainerIterator<Key,
        Unique extends boolean, 
        SourceT extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>, 
        // ContainerT extends IContainer<Key, SourceT, IteratorT, ReverseT, Key>, 
        IteratorT extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends IContainerIterator<Key, SourceT, IteratorT, ReverseT, Key>
{
}

export interface ISetContainerReverseIterator<Key,
        Unique extends boolean, 
        SourceT extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>, 
        // ContainerT extends IContainer<Key, SourceT, IteratorT, ReverseT, Key>, 
        IteratorT extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends IContainerReverseIterator<Key, SourceT, IteratorT, ReverseT, Key>
{
}

// export type ISetContainerEmplaceRet<Key, T, 
//         Unique extends boolean, 
//         SourceT extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>, 
//         // ContainerT extends IContainer<Key, SourceT, IteratorT, ReverseT, Key>, 
//         IteratorT extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
//         ReverseT extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
//     = Unique extends true
//         ? Pair<IteratorT, boolean>
//         : IteratorT;