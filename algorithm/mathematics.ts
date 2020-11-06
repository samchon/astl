import { Pair } from "../utility/Pair";
import { advance, distance } from "../iterator/global";
import { iter_swap, reverse } from "./modifiers";
import { mismatch } from "./iterations";

/* =========================================================
    MATHMATICS
        - MIN & MAX
        - PERMUTATION
        - MISCELLANEOUS
============================================================
    MIN & MAX
--------------------------------------------------------- */
export function min_element<ForwardIterator, Comparator>
    (
        first: ForwardIterator, last: ForwardIterator, 
        comp: Comparator
    ): ForwardIterator
{
    let smallest: ForwardIterator = first;
    for (first = first.next(); first != last; first = first.next())
        if (comp(first.value, smallest.value) === true)
            smallest = first;
    return smallest;
}

export function max_element<ForwardIterator, Comparator>
    (
        first: ForwardIterator, last: ForwardIterator, 
        comp: Comparator
    ): ForwardIterator
{
    let largest: ForwardIterator = first;
    for (first = first.next(); first != last; first = first.next())
        if (comp(first.value, largest.value) === false)
            largest = first;
    return largest;
}

export function minmax_element<ForwardIterator, Comparator>
    (
        first: ForwardIterator, last: ForwardIterator, 
        comp: Comparator
    ): Pair<ForwardIterator, ForwardIterator>
{
    let smallest: ForwardIterator = first;
    let largest: ForwardIterator = first;

    for (first = first.next(); first != last; first = first.next())
    {
        if (comp(first.value, smallest.value) === true)
            smallest = first;
        if (comp(first.value, largest.value) === false) // first is not less than the largest.
            largest = first;
    }
    return new Pair(smallest, largest);
}

export function clamp<T, Comparator>
    (v: T, lo: T, hi: T, comp: Comparator): T
{
    return comp(v, lo) ? lo
        : comp(hi, v) ? hi : v;
}

/* ---------------------------------------------------------
    PERMUATATIONS
--------------------------------------------------------- */
export function is_permutation<ForwardIterator1, ForwardIterator2, BinaryPredicator>
    (
        first1: ForwardIterator1, last1: ForwardIterator1,
        first2: ForwardIterator2,
        pred: BinaryPredicator
    ): boolean
{
    const tuple: Pair<ForwardIterator1, ForwardIterator2> = mismatch(first1, last1, first2, pred);
    first1 = tuple.first;
    first2 = tuple.second;

    if (first1 == last1)
        return true;

    const last2: ForwardIterator2 = advance(first2, distance(first1, last1));
    for (let it = first1; it != last1; it = it.next())
        if (_Find_if(first1, it, pred, it) == it)
        {
            const n: usize = _Count_if(first2, last2, it, pred);
            if (n === 0 || _Count_if(it, last1, it, pred) !== n)
                return false;
        }
    return true;
}

export function prev_permutation<BidirectionalIterator, Comparator, T>
    (
        first: BidirectionalIterator, last: BidirectionalIterator,
        comp: Comparator
    ): boolean
{
    if (first == last)
        return false;

    let previous: BidirectionalIterator = last.prev();
    if (first == previous)
        return false;

    while (true)
    {
        let x: BidirectionalIterator = previous;
        previous = previous.prev();
        
        if (comp(x.value, previous.value) === true)
        {
            let y: BidirectionalIterator = last.prev();
            while (comp(y.value, previous.value) === false)
                y = y.prev();
            
            iter_swap<BidirectionalIterator, BidirectionalIterator, T>(previous, y);
            reverse<BidirectionalIterator, T>(x, last);
            return true;
        }

        if (previous == first)
        {
            reverse<BidirectionalIterator, T>(first, last);
            return false;
        }
    }
}

export function next_permutation<BidirectionalIterator, Comparator, T>
    (
        first: BidirectionalIterator, last: BidirectionalIterator,
        comp: Comparator
    ): boolean
{
    if (first == last)
        return false;

    let previous: BidirectionalIterator = last.prev();
    if (first == previous)
        return false;

    while (true)
    {
        const x: BidirectionalIterator = previous;
        previous = previous.prev();

        if (comp(previous.value, x.value) === true)
        {
            let y: BidirectionalIterator = last.prev();
            while (comp(previous.value, y.value) === false)
                y = y.prev();
            
            iter_swap(previous, y);
            reverse(x, last);
            return true;
        }

        if (previous == first)
        {
            reverse(first, last);
            return false;
        }
    }
}

function _Count_if<InputIterator, TargetIterator, BinaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        it: TargetIterator,
        pred: BinaryPredicator
    ): usize
{
    let count: usize = 0;
    for (; first != last; first = first.next())
        if (pred(first.value, it.value))
            ++count;
    return count;
}

function _Find_if<InputIterator, TargetIterator, BinaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        it: TargetIterator,
        pred: BinaryPredicator,
    ): InputIterator
{
    for (; first != last; first = first.next())
        if (pred(first.value, it.value))
            return first;
    return last;
}