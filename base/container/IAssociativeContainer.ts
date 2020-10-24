import { IContainer } from "./IContainer";

export interface IAssociativeContainer<Key, T extends ElemT,
        SourceT extends IAssociativeContainer<Key, T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends IContainer.Iterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    find(key: Key): IteratorT;
    has(key: Key): boolean;
    count(key: Key): usize;

    erase(key: Key): usize;
    erase(it: IteratorT): IteratorT;
    erase(first: IteratorT, last?: IteratorT): IteratorT;
}