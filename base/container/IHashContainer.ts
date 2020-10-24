import { IContainer } from "./IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { Hasher } from "../../internal/functional/Hasher";
import { BinaryPredicator } from "../../internal/functional/BinaryPredicator";

export interface IHashContainer<Key, T extends ElemT,
        SourceT extends IHashContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends IAssociativeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    hash_function(): Hasher<Key>;
    key_eq(): BinaryPredicator<Key>;

    bucket(key: Key): usize;
    bucket_count(): usize;
    bucket_size(index: usize): usize;

    load_factor(): f64;
    max_load_factor(): f64;
    max_load_factor(z: f64): void;

    reserve(n: usize): void;
    rehash(n: usize): void;
}