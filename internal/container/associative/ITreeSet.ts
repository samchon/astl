import { ISetContainer, ISetContainerIterator, ISetContainerReverseIterator } from "./ISetContainer";

import { Comparator } from "../../functional/Comparator";
import { Pair } from "../../../utility/Pair";

export interface ITreeSet<Key, 
        Unique extends boolean, 
        SourceT extends ITreeSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends ITreeSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ITreeSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainer<Key, Unique, SourceT, IteratorT, ReverseT>
{
    key_comp(): Comparator<Key>;

    lower_bound(key: Key): IteratorT;
    upper_bound(key: Key): IteratorT;
    equal_range(key: Key): Pair<IteratorT, IteratorT>;
}

export interface ITreeSetIterator<Key, 
        Unique extends boolean, 
        SourceT extends ITreeSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends ITreeSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ITreeSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainerIterator<Key, Unique, SourceT, IteratorT, ReverseT>
{
}

export interface ITreeSetReverseIterator<Key, 
        Unique extends boolean, 
        SourceT extends ITreeSet<Key, Unique, SourceT, IteratorT, ReverseT>, 
        IteratorT extends ITreeSetIterator<Key, Unique, SourceT, IteratorT, ReverseT>, 
        ReverseT extends ITreeSetReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>>
    extends ISetContainerReverseIterator<Key, Unique, SourceT, IteratorT, ReverseT>
{
}