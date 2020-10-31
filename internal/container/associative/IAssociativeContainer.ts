import { IContainer, IContainerIterator, IContainerReverseIterator } from "../linear/IContainer";

export interface IAssociativeContainer<Key, T extends InputT,
        SourceT extends IAssociativeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        IteratorT extends IContainerIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ReverseT extends IContainerReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        InputT>
    extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>
{
    count(key: Key): usize;
    find(key: Key): IteratorT;
    has(key: Key): boolean;

    erase_by_key(key: Key): usize;
    erase(first: IteratorT, last?: IteratorT): IteratorT;
}