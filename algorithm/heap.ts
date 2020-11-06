import { distance } from "../iterator/global";

/* =========================================================
    EA-STL (https://github.com/electronicarts/EASTL/blob/master/include/EASTL/heap.h)
        - PUSH & POP
        - SORT
        - INTERNAL
============================================================
    PUSH & POP
--------------------------------------------------------- */
export function make_heap<RandomAccessIterator, Comparator, T>
    (first: RandomAccessIterator, last: RandomAccessIterator, comp: Comparator): void
{
    const heapSize: usize = distance(first, last);
    if (heapSize < 2)
        return;

    let parentPosition: usize = ((heapSize - 2) >> 1) + 1;
    do
    {
        const temp: T = first.advance(--parentPosition).value;
        _Adjust_heap<RandomAccessIterator, T, Comparator>(first, parentPosition, heapSize, parentPosition, temp, comp);
    }
    while (parentPosition !== 0);
}

export function push_heap<RandomAccessIterator, Comparator, T>
    (
        first: RandomAccessIterator, 
        last: RandomAccessIterator, 
        comp: Comparator
    ): void
{
    const temp: T = last.prev().value;
    _Promote_heap(first, 0, distance(first, last) - 1, temp, comp);
}

/**
 * Pop an element from heap.
 * 
 * @param first Random access iteartor of the first position.
 * @param last Random access iterator of the last position.
 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Default is {@link less}.
 */
export function pop_heap<RandomAccessIterator, Comparator, T>
    (
        first: RandomAccessIterator, 
        last: RandomAccessIterator, 
        comp: Comparator
    ): void
{
    const bottom: RandomAccessIterator = last.prev();
    const temp: T = bottom.value;

    bottom.value = first.value;
    _Adjust_heap(first, 0, distance(first, last) - 1, 0, temp, comp);
}

/* ---------------------------------------------------------
    SORT
--------------------------------------------------------- */
export function is_heap<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, 
        last: RandomAccessIterator, 
        comp: Comparator
    ): boolean
{
    const it = is_heap_until(first, last, comp);
    return it.equals(last);
}

export function is_heap_until<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, 
        last: RandomAccessIterator, 
        comp: Comparator
    ): RandomAccessIterator
{
    let counter: number = 0;
    for (let child = first.next(); child < last; child = child.next(), counter ^= 1)
    {
        if (comp(first.value, child.value))
            return child;
        first = advance(first, counter);
    }
    return last;
}

export function sort_heap<RandomAccessIterator, Comparator, T>
    (
        first: RandomAccessIterator, 
        last: RandomAccessIterator, 
        comp: Comparator
    ): void
{
    for (; distance(first, last) > 1; last = last.prev())
        pop_heap<RandomAccessIterator, Comparator, T>(first, last, comp);
}

/* ---------------------------------------------------------
    INTERNAL
--------------------------------------------------------- */
function _Promote_heap<RandomAccessIterator, T, Comparator>
    (
        first: RandomAccessIterator, 
        topPosition: usize, 
        position: usize, 
        value: T, 
        comp: Comparator
    ): void
{
    for (let parentPosition: usize = (position - 1) >> 1;
        (position > topPosition) && comp(first.advance(parentPosition).value, value); 
        parentPosition = (position - 1) >> 1)
    {
        first.advance(position).value = first.advance(parentPosition).value;
        position = parentPosition;
    }
    first.advance(position).value = value;
}

function _Adjust_heap<RandomAccessIterator, T, Comparator>
    (
        first: RandomAccessIterator, 
        topPosition: usize, 
        heapSize: usize, 
        position: usize, 
        value: T, 
        comp: Comparator
    ): void
{
    let childPosition: usize = (2 * position) + 2;
    for (; childPosition < heapSize; childPosition = (2 * childPosition) + 2)
    {
        if (comp(first.advance(childPosition).value, first.advance(childPosition - 1).value))
            --childPosition;
        
        first.advance(position).value = first.advance(childPosition).value;
        position = childPosition;
    }

    if (childPosition === heapSize)
    {
        first.advance(position).value = first.advance(childPosition - 1).value;
        position = childPosition - 1;
    }
    _Promote_heap(first, topPosition, position, value, comp);
}