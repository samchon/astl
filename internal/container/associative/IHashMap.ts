import { IMapContainer } from "./IMapContainer";
import { MapElementList } from "./MapElementList";

import { BinaryPredicator } from "../../functional/BinaryPredicator";
import { Hasher } from "../../functional/Hasher";

export interface IHashMap<Key, T, 
        Unique extends boolean, 
        SourceT extends IHashMap<Key, T, Unique, SourceT>>
    extends IMapContainer<Key, T, Unique, SourceT, 
        MapElementList<Key, T, Unique, SourceT>,
        MapElementList.Iterator<Key, T, Unique, SourceT>,
        MapElementList.ReverseIterator<Key, T, Unique, SourceT>>
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