export function advance<InputIterator>
    (it: InputIterator, n: isize): InputIterator
{
    while (n-- > 0)
        it = it.next();
    return it;
}

export function distance<IteratorT>
    (first: IteratorT, last: IteratorT): isize
{
    let ret: isize = 0;
    for (; first != last; first = first.next())
        ++ret;
    return ret;
}