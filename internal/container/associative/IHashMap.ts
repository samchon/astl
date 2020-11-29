import { IMapContainer, IMapContainerIterator, IMapContainerReverseIterator } from "./IMapContainer";

import { Hasher } from "../../functional/Hasher";
import { BinaryPredicator } from "../../functional/BinaryPredicator";

export interface IHashMap<Key, T, 
        Unique extends boolean, 
        SourceT extends IHashMap<Key, T, Unique, SourceT, IteratorT, ReverseT>,
        IteratorT extends IHashMapIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashMapReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IMapContainer<Key, T, Unique, SourceT, IteratorT, ReverseT>
{
    hash_function(): Hasher<Key>;
    key_eq(): BinaryPredicator<Key>;

    bucket(key: Key): usize;
    bucket_count(): usize;
    bucket_size(index: usize): usize;

    load_factor(): f64;
    max_load_factor(): f64;
    set_max_load_factor(z: f64): void;

    reserve(n: usize): void;
    rehash(n: usize): void;
}

export interface IHashMapIterator<Key, T,
        Unique extends boolean, 
        SourceT extends IHashMap<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IHashMapIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashMapReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IMapContainerIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>
{
}

export interface IHashMapReverseIterator<Key, T,
        Unique extends boolean, 
        SourceT extends IHashMap<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IHashMapIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashMapReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>>
    extends IMapContainerReverseIterator<Key, T, Unique, SourceT, IteratorT, ReverseT>
{
}