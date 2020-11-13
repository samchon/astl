import { IPushBack } from "../internal/container/partial/IPushBack";
import { IPushFront } from "../internal/container/partial/IPushFront";

import { BackInsertIterator } from "./BackInsertIterator";
import { FrontInsertIterator } from "./FrontInsertIterator";
import { InsertIterator } from "./InsertIterator";

/* ---------------------------------------------------------
    ITERATORS
--------------------------------------------------------- */
@inline()
export function begin<Container, Iterator>
    (container: Container): Iterator
{
    return container.begin();
}

@inline()
export function end<Container, Iterator>
    (container: Container): Iterator
{
    return container.end();
}

@inline()
export function rbegin<Container, ReverseIterator>
    (container: Container): ReverseIterator
{
    container.rbegin();
}

@inline()
export function rend<Container, ReverseIterator>
    (container: Container): ReverseIterator
{
    container.rend();
}

@inline()
export function make_reverse_iterator<IteratorT, ReverseT>
    (it: IteratorT): ReverseT
{
    return it.reverse();
}

/* ---------------------------------------------------------
    INSERTERS
--------------------------------------------------------- */
@inline()
export function inserter<ContainerT, IteratorT, T>
    (container: ContainerT, it: IteratorT): InsertIterator<ContainerT, IteratorT, T>
{
    return new InsertIterator(container, it);
}

@inline()
export function front_inserter<Source extends IPushFront<T>, T>
    (source: Source): FrontInsertIterator<Source, T>
{
    return new FrontInsertIterator(source);
}

@inline()
export function back_inserter<Source extends IPushBack<T>, T>
    (source: Source): BackInsertIterator<Source, T>
{
    return new BackInsertIterator(source);
}