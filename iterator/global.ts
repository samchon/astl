import { IEmpty } from "../internal/container/partial/IEmpty";
import { ISize } from "../internal/container/partial/ISize";

/* =========================================================
    GLOBAL FUNCTIONS
        - ACCESSORS
        - MOVERS
        - FACTORIES
============================================================
    ACCESSORS
--------------------------------------------------------- */
@inline
export function empty(source: IEmpty): boolean
{
    return source.empty();
}

@inline
export function size(source: ISize): usize
{
    return source.size();
}

// @todo: specified implementation for the random-access-iterator
export function distance<IteratorT>
    (first: IteratorT, last: IteratorT): isize
{
    let ret: isize = 0;
    for (; first != last; first = first.next())
        ++ret;
    return ret;
}

/* ---------------------------------------------------------
    ACCESSORS
--------------------------------------------------------- */
// @todo: specified implementation for the random-access-iterator
export function advance<InputIterator>
    (it: InputIterator, n: isize): InputIterator
{
    while (n-- > 0)
        it = it.next();
    return it;
}

export function prev<BidirectionalIterator>
    (it: BidirectionalIterator, n: usize = 1): BidirectionalIterator
{
    if (n === 1)
        return it.prev();
    else
        return advance(it, -<isize>n);
}

export function next<ForwardIterator>
    (it: ForwardIterator, n: usize = 1): ForwardIterator
{
    if (n === 1)
        return it.next();
    else
        return advance(it, n);
}