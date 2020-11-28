import { IContainerIterator, IContainerReverseIterator } from "../linear/IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { IPair } from "../../../utility/IPair";
// import { Pair } from "../../../utility/Pair";
import { Entry } from "../../../utility/Entry";

export interface IMapContainer<Key, T, 
        Unique extends boolean, 
        SourceT extends IMapContainer<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IMapContainerIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IMapContainerReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IAssociativeContainer<Key, Entry<Key, T>, SourceT, IteratorT, ReverseT, IPair<Key, T>>
{
    // emplace(key: Key, value: T): IMapContainerEmplaceRet<Key, T, Unique, SourceT, IteratorT, ReverseT>;
    emplace_hint(hint: IteratorT, key: Key, value: T): IteratorT;
    insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void;
}

export interface IMapContainerIterator<Key, T, 
        Unique extends boolean, 
        SourceT extends IMapContainer<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IMapContainerIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IMapContainerReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IContainerIterator<Entry<Key, T>, SourceT, IteratorT, ReverseT, IPair<Key, T>>
{
    readonly first: Key;
    second: T;
}

export interface IMapContainerReverseIterator<Key, T, 
        Unique extends boolean, 
        SourceT extends IMapContainer<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IMapContainerIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IMapContainerReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IContainerReverseIterator<Entry<Key, T>, SourceT, IteratorT, ReverseT, IPair<Key, T>>
{
    readonly first: Key;
    second: T;
}

// export type IMapContainerEmplaceRet<Key, T, 
//         Unique extends boolean, 
//         SourceT extends IMapContainer<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
//         // ContainerT extends IContainer<Entry<Key, T>, SourceT, IteratorT, ReverseT, IPair<Key, T>>, 
//         IteratorT extends IMapContainerIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
//         ReverseT extends IMapContainerReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
//     = Unique extends true
//         ? Pair<IteratorT, boolean>
//         : IteratorT;