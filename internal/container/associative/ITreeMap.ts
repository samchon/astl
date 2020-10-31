import { IMapContainer, IMapContainerIterator, IMapContainerReverseIterator } from "./IMapContainer";
import { IContainer } from "../linear/IContainer";

import { IPair } from "../../../utility/IPair";
import { Pair } from "../../../utility/Pair";
import { Entry } from "../../../utility/Entry";
import { Comparator } from "../../functional/Comparator";

export interface ITreeMap<Key, T, 
        Unique extends boolean, 
        SourceT extends ITreeMap<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
        IteratorT extends ITreeMapIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ReverseT extends ITreeMapReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
    extends IMapContainer<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>
{
    key_comp(): Comparator<Key>;

    lower_bound(key: Key): IteratorT;
    upper_bound(key: Key): IteratorT;
    equal_range(key: Key): Pair<IteratorT, IteratorT>;
}

export interface ITreeMapIterator<Key, T, 
        Unique extends boolean, 
        SourceT extends ITreeMap<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
        IteratorT extends ITreeMapIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ReverseT extends ITreeMapReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
    extends IMapContainerIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>
{
    readonly first: Key;
    second: T;
}

export interface ITreeMapReverseIterator<Key, T, 
        Unique extends boolean, 
        SourceT extends ITreeMap<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
        IteratorT extends ITreeMapIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
        ReverseT extends ITreeMapReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
    extends IMapContainerReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>
{
    readonly first: Key;
    second: T;
}