import { BinaryPredicator } from "../internal/functional/BinaryPredicator";

export function gcd<T>(x: T, y: T): T
{
    while (y != 0)
    {
        const value: T = x % y;
        x = y;
        y = value;
    }
    return x;
}

@inline
export function lcd<T>(x: T, y: T): T
{
    return x * y / gcd<T>(x, y);
}

/* ---------------------------------------------------------
    COMMON ALGORITHMS
--------------------------------------------------------- */
export function iota<ForwardIterator, T>
    (first: ForwardIterator, last: ForwardIterator, value: T): void
{
    for (; first != last; first = first.next())
        first.value = value++;
}

export function accumulate<InputIterator, T, Operator>
    (first: InputIterator, last: InputIterator, init: T, op: Operator): T
{
    for (; first != last; first = first.next())
        init = op(init, first.value);
    return init;
}

export function inner_product<InputIterator1, InputIterator2, T, PlusOperator, MultiplyOperator>
    (
        first1: InputIterator1, last1: InputIterator1,
        first2: InputIterator2,
        value: T,
        adder: PlusOperator,
        multiplier: MultiplyOperator
    ): T
{
    for (; first1 != last1; first1 = first1.next())
    {
        value = adder(value, multiplier(first1.value, first2.value));
        first2 = first2.next();
    }
    return value;
}

export function adjacent_difference<InputIterator, OutputIterator, SubtractOperator>
    (
        first: InputIterator, 
        last: InputIterator, 
        output: OutputIterator,
        subtracter: SubtractOperator
    ): OutputIterator
{
    if (first == last)
        return output;

    let before = first.value;
    for (first = first.next(); !first.equals(last); first = first.next())
    {
        output.value = subtracter(first.value, before);

        before = first.value;
        output = output.next();
    }
    return output;
}

export function partial_sum<InputIterator, OutputIterator, PlusOperator>
    (
        first: InputIterator, last: InputIterator, 
        output: OutputIterator, 
        adder: PlusOperator
    ): OutputIterator
{
    if (first == last)
        return output;

    let sum = first.value;
    for (first = first.next(); !first.equals(last); first = first.next())
    {
        sum = adder(sum. first.value);

        output.value = sum;
        output = output.next();
    }
    return output;
}

/* ---------------------------------------------------------
    PREFIX SUMS
--------------------------------------------------------- */
@inline
export function inclusive_scan<InputIterator, OutputIterator, PlusOperator, T>
    (
        first: InputIterator, last: InputIterator,
        output: OutputIterator,
        op: PlusOperator
    ): OutputIterator
{
    return transform_inclusive_scan<InputIterator, OutputIterator, PlusOperator, (val: T) => T, T>(first, last, output, op, val => val);
}

@inline
export function exclusive_scan<InputIterator, OutputIterator, T, PlusOperator>
    (
        first: InputIterator, last: InputIterator,
        output: OutputIterator,
        init: T,
        op: PlusOperator
    ): OutputIterator
{
    return transform_exclusive_scan<InputIterator, OutputIterator, T, PlusOperator, (val: T) => T>(first, last, output, init, op, val => val);
}

export function transform_inclusive_scan<InputIterator, OutputIterator, BinaryOperator, UnaryOperator, T>
    (
        first: InputIterator, last: InputIterator,
        output: OutputIterator,
        binary: BinaryOperator,
        unary: UnaryOperator
    ): OutputIterator
{
    if (first == last)
        return output;

    let before = first.value;
    for (first = first.next(); !first.equals(last); first = first.next())
    {
        before = binary(before, unary(first.value));

        output.value = before;
        output = output.next();
    }
    return output;
}

export function transform_exclusive_scan<InputIterator, OutputIterator, T, BinaryOperator, UnaryOperator>
    (
        first: InputIterator, last: InputIterator,
        output: OutputIterator,
        init: T,
        binary: BinaryOperator,
        unary: UnaryOperator
    ): OutputIterator
{
    if (first == last)
        return output;

    let x: T = unary(first.value);
    let y: T = init;

    for (first = first.next(); !first.equals(last); first = first.next())
    {
        y = binary(x, y);
        x = unary(first.value);

        output.value = y;
        output = output.next();
    }
    return output;
}