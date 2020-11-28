import { IContainer, IContainerIterator, IContainerReverseIterator } from "../linear/IContainer";
import { IAssociativeContainer } from "./IAssociativeContainer";

import { Comparator } from "../../functional/Comparator";
import { Pair } from "../../../utility/Pair";


export interface ITreeContainer<Key, T extends InputT,
        SourceT extends ITreeContainer<Key, T, SourceT, IteratorT, ReverseT, InputT>,
        // ContainerT extends IContainer<T, SourceT, IteratorT, ReverseT, InputT>,
        IteratorT extends IContainerIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        ReverseT extends IContainerReverseIterator<T, SourceT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IAssociativeContainer<Key, T, SourceT, IteratorT, ReverseT, InputT>
{
    key_comp(): Comparator<Key>;

    lower_bound(key: Key): IteratorT;
    upper_bound(key: Key): IteratorT;
    equal_range(key: Key): Pair<IteratorT, IteratorT>;
}