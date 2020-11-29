import { ISetContainer, ISetContainerIterator, ISetContainerReverseIterator } from "./ISetContainer";

import { BinaryPredicator } from "../../functional/BinaryPredicator";
import { Hasher } from "../../functional/Hasher";

export interface IHashSet<Key, 
        Unique extends boolean, 
        SourceT extends IHashSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IHashSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>
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

export interface IHashSetIterator<Key, 
        Unique extends boolean, 
        SourceT extends IHashSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IHashSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>
{
}

export interface IHashSetReverseIterator<Key, 
        Unique extends boolean, 
        SourceT extends IHashSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends IHashSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends IHashSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>
{
}