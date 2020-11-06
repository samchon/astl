/* =========================================================
    MODIFIERS (MODIFYING SEQUENCE)
        - FILL
        - REMOVE
        - REPLACE & SWAP
        - RE-ARRANGEMENT
============================================================
    FILL
--------------------------------------------------------- */
export function copy<InputIterator, OutputIterator>
    (first: InputIterator, last: InputIterator, output: OutputIterator): OutputIterator
{
    for (; first != last; first = first.next())
    {
        output.value = first.value;
        output = output.next();
    }
    return output;
}

export function copy_n<InputIterator, OutputIterator>
    (first: InputIterator, n: usize, output: OutputIterator): OutputIterator
{
    for (let i: usize = 0; i < n; ++i)
    {
        output.value = first.value;

        output.value = first.value;
        output = output.next();
    }
    return output;
}

export function copy_if<InputIterator, OutputIterator, UnaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator,
        pred: UnaryPredicator
    ): OutputIterator
{
    for (; first != last; first = first.next())
    {
        if (pred(first.value) === false)
            continue;

        output.value = first.value;
        output = output.next();
    }
    return output;
}

export function iter_swap<ForwardIterator1, ForwardIterator2, T>
    (x: ForwardIterator1, y: ForwardIterator2): void
{
    const value: T = x.value;
    x.value = y.value;
    y.value = value;
}

export function swap_ranges<ForwardIterator1, ForwardIterator2, T>
    (first1: ForwardIterator2, last1: ForwardIterator2, first2: ForwardIterator2): ForwardIterator2
{
    for (; first1 != last1; first1 = first1.next())
    {
        iter_swap<ForwardIterator1, ForwardIterator2, T>(first1, first2);
        first2 = first2.next();
    }
    return first2;
}

export function reverse<BidirectionalIterator, T>
    (first: BidirectionalIterator, last: BidirectionalIterator): void
{
    while (first != last && first != (last = last.prev()))
    {
        iter_swap<BidirectionalIterator, BidirectionalIterator, T>(first, last);
        first = first.next();
    }
}