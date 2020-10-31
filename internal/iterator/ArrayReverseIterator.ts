import { IContainer } from "../container/linear/IContainer";
import { IArrayContainer } from "../container/linear/IArrayContainer";

import { ArrayIterator } from "./ArrayIterator";
import { ReverseIterator } from "./ReverseIterator";

export abstract class ArrayReverseIterator<T extends InputT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        ContainerT extends IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        IteratorT extends ArrayIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>, 
        ReverseT extends ArrayReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>,
        InputT>
    extends ReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, InputT>
{
    @inline()
    public advance(n: isize): ReverseT
    {
        return this.base().advance(-n).reverse();
    }

    @inline()
    public index(): usize
    {
        return this.base().index();
    }
}