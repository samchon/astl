import { Vector } from "../container/Vector";
import { distance } from "../iterator/global";
import { copy, iter_swap } from "./modifiers";

/* =========================================================
    SORTINGS
        - SORT
        - INSPECTOR
        - BACKGROUND
============================================================
    SORT
--------------------------------------------------------- */
export function sort<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, last: RandomAccessIterator,
        comp: Comparator
    ): void
{
    const length: usize = distance(first, last);
    if (length <= 0)
        return;

    const pivotIt: RandomAccessIterator = first.advance(length / 2);
    const pivot = pivotIt.value;

    if (pivotIt != first)
        iter_swap<RandomAccessIterator, RandomAccessIterator>(first, pivotIt);

    let i: usize = 1;
    for (let j: usize = 1; j < length; ++j)
    {
        const jeIt: RandomAccessIterator = first.advance(j);
        if (comp(jeIt.value, pivot))
        {
            iter_swap<RandomAccessIterator, RandomAccessIterator>(jeIt, first.advance(i));
            ++i;
        }
    }
    iter_swap<RandomAccessIterator, RandomAccessIterator>(first, first.advance(i - 1));

    sort<RandomAccessIterator, Comparator>(first, first.advance(i - 1), comp);
    sort<RandomAccessIterator, Comparator>(first.advance(i), last, comp);
}

export function stable_sort<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, last: RandomAccessIterator,
        comp: Comparator
    ): void
{
    const length: isize = distance(first, last);
    if (length <= 0)
        return;

    const pivotIt: RandomAccessIterator = first.advance(length / 2);
    const pivot = pivotIt.value;

    if (pivotIt != first)
        iter_swap<RandomAccessIterator, RandomAccessIterator>(first, pivotIt);

    let i: usize = 1;
    for (let j: usize = 1; j < length; ++j)
    {
        const jeIt: RandomAccessIterator = first.advance(j);
        if (comp(jeIt.value, pivot) && !comp(pivot, jeIt.value))
        {
            iter_swap<RandomAccessIterator, RandomAccessIterator>(jeIt, first.advance(i));
            ++i;
        }
    }
    iter_swap<RandomAccessIterator, RandomAccessIterator>(first, first.advance(i - 1));

    sort<RandomAccessIterator, Comparator>(first, first.advance(i - 1), comp);
    sort<RandomAccessIterator, Comparator>(first.advance(i), last, comp);
}

export function partial_sort<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, middle: RandomAccessIterator, last: RandomAccessIterator,
        comp: Comparator
    ): void
{
    for (let i: RandomAccessIterator = first; i != middle; i = i.next())
    {
        let min: RandomAccessIterator = i;
        for (let j: RandomAccessIterator = i.next(); j != last; j = j.next())
            if (comp(j.value, min.value))
                min = j;
        if (i != min)
            iter_swap<RandomAccessIterator, RandomAccessIterator>(i, min);
    }
}

export function partial_sort_copy<InputIterator, OutputIterator, Comparator, T>
    (
        first: InputIterator, last: InputIterator, 
        outputFirst: OutputIterator, outputLast: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    const inputLength: isize = distance<InputIterator>(first, last);
    const resultLength: isize = distance<OutputIterator>(outputFirst, outputLast);

    const vector: Vector<T> = new Vector();
    vector.insert(vector.end(), first, last);
    sort<Vector.Iterator<T>, Comparator>(vector.begin(), vector.end(), comp);

    if (inputLength > resultLength)
        outputFirst = copy(vector.begin(), vector.begin().advance(resultLength), outputFirst);
    else
        outputFirst = copy(vector.begin(), vector.end(), outputFirst);

    return outputFirst;
}

export function nth_element<RandomAccessIterator, Comparator>
    (
        first: RandomAccessIterator, nth: RandomAccessIterator, last: RandomAccessIterator, 
        comp: Comparator
    ): void
{
    const n: isize = distance(first, nth);
    for (let i = first; i != last; i = i.next())
    {
        let count: isize = 0;
        for (let j = first; j != last; j = j.next())
            if (i == j)
                continue;
            else if (comp(i.value, j.value) && ++count > n)
                break;

        if (count === n)
        {
            iter_swap<RandomAccessIterator, RandomAccessIterator>(nth, i);
            return;
        }
    }
}

/* ---------------------------------------------------------
    INSPECTOR
--------------------------------------------------------- */
@inline()
export function is_sorted<InputIterator, Comparator>
    (first: InputIterator, last: InputIterator, comp: Comparator): boolean
{
    const it: InputIterator = is_sorted_until<InputIterator, Comparator>(first, last, comp);
    const ret: boolean = (it == last);

    trace("is_sorted: " + ret.toString());
    return ret;
}

export function is_sorted_until<InputIterator, Comparator>
    (first: InputIterator, last: InputIterator, comp: Comparator): InputIterator
{
    if (first == last)
        return last;

    for (let it = first.next(); it != last; it = it.next())
        if (comp(it.value, first.value))
            return it;
        else
            first = first.next();
    
    return last;
}