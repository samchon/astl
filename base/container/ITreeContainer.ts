import { IContainer } from "./IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { Comparator } from "../../internal/functional/Comparator";
import { Pair } from "../../utility/Pair";

export interface ITreeContainer<Key, T extends ElemT,
        SourceT extends ITreeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends IAssociativeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    key_comp(): Comparator<Key>;
    value_comp(): Comparator<T>;

    lower_bound(key: Key): IteratorT;
    upper_bound(key: Key): IteratorT;
    equal_range(key: Key): Pair<IteratorT, IteratorT>;
}