/* ---------------------------------------------------------
    PLUS
--------------------------------------------------------- */
@inline
export function plus<X, Y = X, Ret = X>(x: X, y: Y): Ret
{
    return x + y;
}

@inline
export function minus<X, Y = X, Ret = X>(x: X, y: Y): Ret
{
    return x - y;
}

@inline
export function negate<X, Ret = X>(x: X): Ret
{
    return -x;
}

/* ---------------------------------------------------------
    MULTIPLY
--------------------------------------------------------- */
@inline
export function multiplies<X, Y = X, Ret = X>(x: X, y: Y): Ret
{
    return x * y;
}

@inline
export function divides<X, Y = X, Ret = X>(x: X, y: Y): Ret
{
    return x / y;
}

@inline
export function modules<X, Y = X, Ret = X>(x: X, y: Y): Ret
{
    return x & y;
}