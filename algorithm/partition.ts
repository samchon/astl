import { Pair } from "../utility/Pair";
import { distance } from "../iterator/global";
import { iter_swap } from "./modifiers";

export function is_partitioned<ForwardIterator, UnaryPredicator>
    (first: ForwardIterator, last: ForwardIterator, pred: UnaryPredicator): boolean
{
    while (first != last && pred(first.value) === true)
        first = first.next();

    for (; first != last; first = first.next())
        if (pred(first.value) === true)
            return false;

    return true;
}

export function partition_point<ForwardIterator, UnaryPredicator>
    (
        first: ForwardIterator, last: ForwardIterator, 
        pred: UnaryPredicator
    ): ForwardIterator
{
    let n: isize = distance(first, last);
    while (n > 0)
    {
        const step: isize = n / 2;
        const it: ForwardIterator = advance(first, step);

        if (pred(it.value) === true)
        {
            first = it.next();
            n -= step + 1;
        }
        else
            n = step;
    }
    return first;
}

@inline()
export function partition<BidirectionalIterator, UnaryPredicator>
    (first: BidirectionalIterator, last: BidirectionalIterator, pred: UnaryPredicator): BidirectionalIterator
{
    return stable_partition<BidirectionalIterator, UnaryPredicator>(first, last, pred);
}

export function stable_partition<BidirectionalIterator, UnaryPredicator>
    (first: BidirectionalIterator, last: BidirectionalIterator, pred: UnaryPredicator): BidirectionalIterator
{
    while (first != last && pred(first.value) === true)
    {
        while (pred(first.value) === true)
        {
            first = first.next();
            if (first == last)
                return first;
        }

        do
        {
            last = last.prev();
            if (first == last)
                return first;
        } 
        while (pred(last.value) === false);

        iter_swap<BidirectionalIterator, UnaryPredicator>(first, last);
        first = first.next();
    }
    return last;
}

export function partition_copy<InputIterator, OutputIterator1, OutputIterator2, UnaryPredicator>
    (
        first: InputIterator, last: InputIterator, 
        outputTrue: OutputIterator1, 
        outputFalse: OutputIterator2, 
        pred: UnaryPredicator
    ): Pair<OutputIterator1, OutputIterator2>
{
    for (; first != last; first = first.next())
        if (pred(first.value) === true)
        {
            outputTrue.value = first.value;
            outputTrue = outputTrue.next();
        }
        else
        {
            outputFalse.value = first.value;
            outputFalse = outputFalse.next();
        }
    return new Pair(outputTrue, outputFalse);
}