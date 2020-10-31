import { IContainer, IContainerIterator, IContainerReverseIterator } from "../linear/IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { Hasher } from "../../functional/Hasher";
import { BinaryPredicator } from "../../functional/BinaryPredicator";

export interface IHashContainer<Key, T extends InputT,
        SourceT extends IHashContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        IteratorT extends IContainerIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ReverseT extends IContainerReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IAssociativeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, InputT>
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