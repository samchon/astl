import { IContainer } from "../../base/container/IContainer";
import { ListContainer } from "../container/linear/ListContainer";

import { ReverseIterator } from "./ReverseIterator";
import { ListIterator } from "./ListIterator";

export abstract class ListReverseIterator<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    public abstract get value(): T;
}