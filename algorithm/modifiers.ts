import { advance } from "../iterator/global";
import { randint } from "./random";

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

export function copy_backward<InputIterator, OutputIterator>
    (first: InputIterator, last: InputIterator, output: OutputIterator): OutputIterator
{
    last = last.prev();
    while (last != first)
    {
        last = last.prev();
        output = output.prev();

        output.value = last.value;
    }
    return output;
}

export function fill<ForwardIterator, T>
    (first: ForwardIterator, last: ForwardIterator, val: T): void
{
    for (; first != last; first = first.next())
        first.value = val;
}

export function fill_n<OutputIterator, T>
    (first: OutputIterator, n: usize, val: T): OutputIterator
{
    for (let i: usize = 0; i < n; ++i)
    {
        first.value = val;
        first = first.next();
    }
    return first;
}

export function transform<InputIterator, OutputIterator, UnaryOperator>
    (
        first: InputIterator, last: InputIterator, 
        result: OutputIterator, 
        op: UnaryOperator
    ): OutputIterator
{
    for (; first != last; first = first.next())
    {
        result.value = op(first.value);
        result = result.next();
    }
    return result;
}

export function transform_binary<InputIterator1, InputIterator2, OutputIterator, BinaryOperator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2,
        result: OutputIterator,
        op: BinaryOperator
    ): OutputIterator
{
    for (; first1 != last1; first1 = first1.next())
    {
        result.value = op(first1.value, first2.value);
        first2 = first2.next();
        result = result.next();
    }
    return result;
}

export function generate<ForwardIterator, Generator>
    (first: ForwardList, last: ForwardIterator, generator: Generator): void
{
    for (; first != last; first = first.next())
        first.value = generator();
}

export function generate_n<ForwardIterator, Generator>
    (first: ForwardList, n: usize, generator: Generator): void
{
    for (let i: usize = 0; i < n; ++i)
    {
        first.value = generator();
        first = first.next();
    }
}

/* ---------------------------------------------------------
    REMOVE
--------------------------------------------------------- */
export function unique<InputIterator, BinaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        pred: BinaryPredicator
    ): InputIterator
{
    if (first == last)
        return last;

    let ret: InputIterator = first;
    for (first = first.next(); first != last; first = first.next())
        if (pred(ret.value, first.value) === false)
        {
            ret = ret.next();
            ret.value = first.value;
        }
    return ret.next();
}

export function unique_copy<InputIterator, OutputIterator, BinaryPredicator>
    (
        first: InputIterator, last: InputIterator, output: OutputIterator, 
        pred: BinaryPredicator
    ): OutputIterator
{
    if (first == last)
        return output;

    output.value = first.value;
    first = first.next();

    for (; first != last; first = first.next())
        if (pred(first.value, output.value) === false)
        {
            output = output.next();
            output.value = first.value;
        }
    return output.next();
}

export function remove<InputIterator, T>
    (first: InputIterator, last: InputIterator, value: T): InputIterator
{
    let output: InputIterator = first;

    for (; first != last; first = first.next())
    {
        if (first.value == value)
            continue;
        output.value = first.value;
        output = output.next();
    }
    return output;
}

export function remove_if<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): InputIterator
{
    let output: InputIterator = first;

    for (; first != last; first = first.next())
        if (pred(first.value) === false)
        {
            output.value = first.value;
            output = output.next();
        }
    return output;
}

export function remove_copy<InputIterator, OutputIterator, T>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator,
        value: T
    ): OutputIterator
{
    for (; first != last; first = first.next())
    {
        if (value == first.value)
            continue;
        output.value = first.value;
        output = output.next();
    }
    return output;
}

export function remove_copy_if<InputIterator, OutputIterator, UnaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator,
        pred: UnaryPredicator
    ): OutputIterator
{
    for (; first != last; first = first.next())
        if (pred(first.value) === false)
        {
            output.value = first.value;
            output = output.next();
        }
    return output;
}

/* ---------------------------------------------------------
    REPLACE & SWAP
--------------------------------------------------------- */
export function replace<InputIterator, T>
    (
        first: InputIterator, last: InputIterator,
        oldVal: T,
        newVal: T
    ): void
{
    for (; first != last; first = first.next())
        if (first.value == oldVal)
            first.value = newVal;
}

export function replace_if<InputIterator, UnaryPredicator, T>
    (
        first: InputIterator, last: InputIterator,
        pred: UnaryPredicator,
        newVal: T
    ): void
{
    for (; first != last; first = first.next())
        if (pred(first.value) === true)
            first.value = newVal;
}

export function replace_copy<InputIterator, OutputIterator, T>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator,
        oldVal: T, 
        newVal: T
    ): OutputIterator
{
    for (; first != last; first = first.next())
    {
        output.value = (first.value == oldVal)
            ? newVal
            : first.value;
        output = output.next();
    }
    return output;
}

export function replace_copy_if<InputIterator, OutputIterator, UnaryPredicator, T>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator,
        pred: UnaryPredicator, 
        newVal: T
    ): OutputIterator
{
    for (; first != last; first = first.next())
    {
        output.value = (pred(first.value) === true)
            ? newVal
            : first.value;
        output = output.next();
    }
    return output;
}

export function iter_swap<ForwardIterator1, ForwardIterator2>
    (x: ForwardIterator1, y: ForwardIterator2): void
{
    const value = x.value;
    x.value = y.value;
    y.value = value;
}

export function swap_ranges<ForwardIterator1, ForwardIterator2>
    (first1: ForwardIterator2, last1: ForwardIterator2, first2: ForwardIterator2): ForwardIterator2
{
    for (; first1 != last1; first1 = first1.next())
    {
        iter_swap<ForwardIterator1, ForwardIterator2>(first1, first2);
        first2 = first2.next();
    }
    return first2;
}

/* ---------------------------------------------------------
    RE-ARRANGEMENT
--------------------------------------------------------- */
export function reverse<BidirectionalIterator>
    (first: BidirectionalIterator, last: BidirectionalIterator): void
{
    while (first != last && first != (last = last.prev()))
    {
        iter_swap<BidirectionalIterator, BidirectionalIterator>(first, last);
        first = first.next();   
    }
}

export function reverse_copy<BidirectionalIterator, OutputIterator>
    (first: BidirectionalIterator, last: BidirectionalIterator, output: OutputIterator): OutputIterator
{
    while (last != first)
    {
        last = last.prev();

        output.value = last.value;
        output = output.next();
    }
    return output;
}

export function shift_left<ForwardIterator>
    (first: ForwardIterator, last: ForwardIterator, n: usize): ForwardIterator
{
    const mid: ForwardIterator = advance(first, n);
    return copy(mid, last, first);
}

export function shift_right<ForwardIterator>
    (first: ForwardIterator, last: ForwardIterator, n: usize): ForwardIterator
{
    const mid: ForwardIterator = advance(last, -n);
    return copy(first, mid, last);
}

export function rotate<InputIterator>
    (first: InputIterator, middle: InputIterator, last: InputIterator): InputIterator
{
    while (first != middle && middle != last)
    {
        iter_swap<InputIterator, InputIterator>(first, middle);

        first = first.next();
        middle = middle.next();
    }
    return first;
}

export function rotate_copy<ForwardIterator, OutputIterator>
    (first: ForwardIterator, middle: ForwardIterator, last: ForwardIterator, output: OutputIterator): OutputIterator
{
    output = copy(middle, last, output);
    return copy(first, middle, output);
}

export function shuffle<RandomAccessIterator>
    (first: RandomAccessIterator, last: RandomAccessIterator): void
{
    for (let it = first; it != last; it = it.next())
    {
        const index: usize = randint<usize>(first.index(), last.index() - 1);
        if (it.index() !== index)
            iter_swap<RandomAccessIterator, RandomAccessIterator>(it, first.advance(index));
    }
}