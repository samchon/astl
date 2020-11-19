import { Pair } from "../utility/Pair";
import { advance, distance } from "../iterator";

export function lower_bound<ForwardIterator, T, Comparator>
    (first: ForwardIterator, last: ForwardIterator, val: T, comp: Comparator): ForwardIterator
{
    let count: isize = distance(first, last);
    while (count > 0)
    {
        const step: isize = count / 2;
        const it: ForwardIterator = advance(first, step);

        if (comp(it.value, val) === true)
        {
            first = it.next();
            count -= step + 1;
        }
        else
            count = step;
    }
    return first;
}

export function upper_bound<ForwardIterator, T, Comparator>
    (first: ForwardIterator, last: ForwardIterator, val: T, comp: Comparator): ForwardIterator
{
    let count: isize = distance(first, last);
    while (count > 0)
    {
        const step: isize = count / 2;
        const it: ForwardIterator = advance(first, step);

        if (comp(val, it.value) === false)
        {
            first = it.next();
            count -= step + 1;
        }
        else
            count = step;
    }
    return first;
}

@inline
export function equal_range<ForwardIterator, T, Comparator>
    (first: ForwardIterator, last: ForwardIterator, val: T, comp: Comparator): Pair<ForwardIterator, ForwardIterator>
{
    const lower: ForwardIterator = lower_bound<ForwardIterator, T, Comparator>(first, last, val, comp);
    const upper: ForwardIterator = upper_bound<ForwardIterator, T, Comparator>(lower, last, val, comp);

    return new Pair(lower, upper);
}

@inline
export function binary_search<ForwardIterator, T, Comparator>
    (first: ForwardIterator, last: ForwardIterator, val: T, comp: Comparator): boolean
{
    first = lower_bound<ForwardIterator, T, Comparator>(first, last, val, comp);
    return first != last && comp(val, first.value) === false;
}