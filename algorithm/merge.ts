import { Vector } from "../container/Vector";
import { back_inserter } from "../iterator/factory";
import { copy } from "./modifiers";

/* =========================================================
    MERGE & SET OPERATIONS
        - MERGE
        - SET OPERATION
============================================================
    MERGE
--------------------------------------------------------- */
export function merge<InputIterator1, InputIterator2, OutputIterator, Comparator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        output: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    while (true)
    {
        if (first == last1)
            return copy(first2, last2, output);
        else if (first2 == last2)
            return copy(first1, last1, output);

        if (comp(first1.value, first2.value) === true)
        {
            output.value = first1.value;
            first1 = first1.next();
        }
        else
        {
            output.value = first2.value;
            first2 = first2.next();
        }
        output = output.next();
    }
}

export function inplace_merge<BidirectionalIterator, Comparator, T>
    (
        first: BidirectionalIterator, 
        middle: BidirectionalIterator, 
        last: BidirectionalIterator, 
        comp: Comparator
    ): void
{
    const vector: Vector<T> = new Vector();

    merge(first, middle, middle, last, back_inserter<Vector<T>, T>(vector), comp);
    copy(vector.begin(), vector.end(), first);
}

/* ---------------------------------------------------------
    SET OPERATIONS
--------------------------------------------------------- */
export function set_union<InputIterator1, InputIterator2, OutputIterator, Comparator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        output: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    while (true)
    {
        if (first1 == last1)
            return copy(first2, last2, output);
        else if (first2 == last2)
            return copy(first1, last1, output);

        if (comp(first1.value, first2.value) === true)
        {
            output.value = first1.value;
            first1 = first1.next();
        }
        else if (comp(first2.value, first1.value) === true)
        {
            output.value = first2.value;
            first2 = first2.next();
        }
        else 
        {
            output.value = first1.value;

            first1 = first1.next();
            first2 = first2.next();
        }
        output = output.next();
    }
}

export function set_intersection<InputIterator1, InputIterator2, OutputIterator, Comparator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        output: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    while (first1 != last1 && first2 != last2)
        if (comp(first1.value, first2.value) === true)
            first1 = first1.next();
        else if (comp(first2.value, first1.value) === true)
            first2 = first2.next();
        else
        {
            output.value = first1.value;

            output = output.next();
            first1 = first1.next();
            first2 = first2.next();
        }
    return output;
}

export function set_difference<InputIterator1, InputIterator2, OutputIterator, Comparator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        output: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    while (first1 != last1 && first2 != last2)
        if (comp(first1.value, first2.value) === true)
        {
            output.value = first1.value;

            output = output.next();
            first1 = first1.next();
        }
        else if (comp(first2.value, first1.value) === true)
            first2 = first2.next();
        else
        {
            first1 = first1.next();
            first2 = first2.next();
        }
    return copy(first1, last1, output);
}

export function set_symmetric_difference<InputIterator1, InputIterator2, OutputIterator, Comparator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        output: OutputIterator, 
        comp: Comparator
    ): OutputIterator
{
    while (true)
    {
        if (first1 == last1)
            return copy(first2, last2, output);
        else if (first2 == last2)
            return copy(first1, last1, output);

        if (comp(first1.value, first2.value) === true)
        {
            output.value = first1.value;

            output = output.next();
            first1 = first1.next();
        }
        else if (comp(first2.value, first1.value) === true)
        {
            output.value = first2.value;

            output = output.next();
            first2 = first2.next();
        }
        else 
        {// equals
            first1 = first1.next();
            first2 = first2.next();
        }
    }
}