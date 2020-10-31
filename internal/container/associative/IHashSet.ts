import { ISetContainer } from "./ISetContainer";
import { SetElementList } from "./SetElementList";

import { BinaryPredicator } from "../../functional/BinaryPredicator";
import { Hasher } from "../../functional/Hasher";

export interface IHashSet<Key, 
        Unique extends boolean, 
        SourceT extends IHashSet<Key, Unique, SourceT>>
    extends ISetContainer<Key, Unique, SourceT, 
        SetElementList<Key, Unique, SourceT>,
        SetElementList.Iterator<Key, Unique, SourceT>,
        SetElementList.ReverseIterator<Key, Unique, SourceT>>
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