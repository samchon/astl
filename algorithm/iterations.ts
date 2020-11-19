import { Pair } from "../utility/Pair";
import { advance, distance } from "../iterator/global";

/* =========================================================
    ITERATIONS (NON-MODIFYING SEQUENCE)
        - FOR_EACH
        - AGGREGATE CONDITIONS
        - FINDERS
        - COUNTERS
============================================================
    FOR_EACH
--------------------------------------------------------- */
@inline
export function for_eacah<InputIterator, Closure>
    (first: InputIterator, last: InputIterator, closure: Closure): Closure
{
    for (; first != last; first = first.next())
        closure(first.value);

    return closure;    
}

@inline
export function for_each_n<InputIterator, Closure>
    (first: InputIterator, n: usize, closure: Closure): InputIterator
{
    for (let i: usize = 0; i < n; ++i)
    {
        closure(first.value);
        first = first.next();
    }
    return first;    
}

/* ---------------------------------------------------------
    AGGREGATE CONDITIONS
--------------------------------------------------------- */
@inline
export function all_of<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): boolean
{
    for (; first != last; first = first.next())
        if (pred(first.value) === false)
            return false;
    return true;
}

@inline
export function any_of<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): boolean
{
    for (; first != last; first = first.next())
        if (pred(first.value) === true)
            return true;
    return false;
}

@inline
export function none_of<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): boolean
{
    return !any_of(first, last, pred);
}

export function equal<InputIterator1, InputIterator2, Predicator>
    (
        first1: InputIterator1, 
        last1: InputIterator1, 
        first2: InputIterator2, 
        pred: Predicator
    ): boolean
{
    while (first1 != last1)
        if (!pred(first1.value, first2.value))
            return false;
        else
        {
            first1 = first1.next();
            first2 = first2.next();
        }
    return true;
}

export function lexicographical_compare<Iterator1, Iterator2, Comparator>
    (
        first1: Iterator1, last1: Iterator1, 
        first2: Iterator2, last2: Iterator2,
        comp: Comparator
    ): boolean
{
    while (first1 != last1)
        if (first2 == last2 || comp(first2.value, first1.value) === true)
            return false;
        else if (comp(first1.value, first2.value) === true)
            return true;
        else
        {
            first1 = first1.next();
            first2 = first2.next();
        }
        
    return first2 != last2;
}

/* ---------------------------------------------------------
    FINDERS
--------------------------------------------------------- */
export function find<InputIterator, T>
    (first: InputIterator, last: InputIterator, value: T): InputIterator
{
    for (; first != last; first = first.next())
        if (first.value == value)
            return first;
    return last;
}

@inline
export function find_if<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): InputIterator
{
    for (; first != last; first = first.next())
        if (pred(first.value) === true)
            return first;
    return last;
}

@inline
export function find_if_not<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): InputIterator
{
    for (; first != last; first = first.next())
        if (pred(first.value) === false)
            return first;
    return last;
}

export function find_end<InputIterator1, InputIterator2, BinaryPredicator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2, 
        pred: BinaryPredicator
    ): InputIterator1
{
    if (first2 == last2)
        return last1;

    let ret: InputIterator1 = last1;
    for (; first1 != last1; first1 = first1.next())
    {
        let it1: InputIterator1 = first1;
        let it2: InputIterator2 = first2;

        while (pred(it1.value, it2.value) === true)
        {
            it1 = it1.next();
            it2 = it2.next();

            if (it2 == last2)
            {
                ret = first1;
                break;
            }
            else if (it1 == last1)
                return ret;
        }
    }
    return ret;
}

export function find_first_of<InputIterator1, InputIterator2, BinaryPredicator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2, last2: InputIterator2,
        pred: BinaryPredicator
    ): InputIterator1
{
    for (; first1 != last1; first1 = first1.next())
        for (let it = first2; it != last2; it = it.next())
            if (pred(first1.value, it.value) === true)
                return first1;
    return last1;
}

export function adjacent_find<InputIterator, BinaryPredicator>
    (first: InputIterator, last: InputIterator, pred: BinaryPredicator): InputIterator
{
    if (first != last)
    {
        let next = first.next();
        while (next != last)
        {
            if (pred(first.value, next.value) === true)
                return first;
            first = first.next();
            next = next.next();
        }
    }
    return last;
}

export function search<ForwardIterator1, ForwardIterator2, BinaryPredicator>
    (
        first1: ForwardIterator1, last1: ForwardIterator1, 
        first2: ForwardIterator2, last2: ForwardIterator2,
        pred: BinaryPredicator
    ): FowradIterator1
{
    if (first2 == last2)
        return first1;

    for (; first1 != last1; first1 = first1.next())
    {
        let it1: ForwardIterator1 = first1;
        let it2: ForwardIterator2 = first2;

        while (pred(it1.value, it2.value) === true)
        {
            if (it2 == last2)
                return first1;
            else if (it1 == last1)
                return last1;

            it1 = it1.next();
            it2 = it2.next();
        }
    }
    return last1;
}

export function serach_n<ForwardIterator, T, BinaryPredicator>
    (
        first: ForwardIterator, last: ForwardIterator, 
        count: usize, 
        val: T, 
        pred: BinaryPredicator
    ): ForwardIterator
{
    const limit: ForwardIterator = advance(first, distance(first, last) - count);

    for (; first != limit; first = first.next())
    {
        let it: ForwardIterator = first;
        let i: usize = 0;

        while (pred(it.value, val) === true)
        {
            it = it.next();

            if (++i === count)
                return first;
        }
    }
    return last;
}

export function mismatch<InputIterator1, InputIterator2, BinaryPredicator>
    (
        first1: InputIterator1, last1: InputIterator1, 
        first2: InputIterator2,
        pred: BinaryPredicator
    ): Pair<InputIterator1, InputIterator2>
{
    while (first1 != last1 && pred(first1.value, first2.value) === true)
    {
        first1 = first1.next();
        first2 = first2.next();
    }
    return new Pair(first1, first2);
}

/* ---------------------------------------------------------
    COUNTERS
--------------------------------------------------------- */
@inline
export function count<InputIterator, T>
    (first: InputIterator, last: InputIterator, val: T): usize
{
    let ret: usize = 0;
    for (; first != last; first = first.next())
        if (first.value == val)
            ++ret;
    return ret;
}

export function count_if<InputIterator, UnaryPredicator>
    (first: InputIterator, last: InputIterator, pred: UnaryPredicator): usize
{
    let ret: usize = 0;
    for (; first != last; first = first.next())
        if (pred(first.value, val) === true)
            ++ret;
    return ret;
}