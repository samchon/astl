@inline
export function equal_to<T>(x: T, y: T): boolean
{
    return x == y;
}

@inline
export function not_equal_to<T>(x: T, y: T): boolean
{
    return x != y;
}

@inline
export function less<T>(x: T, y: T): boolean
{
    return x < y;
}

@inline
export function less_equal<T>(x: T, y: T): boolean
{
    return x <= y;
}

@inline
export function greater<T>(x: T, y: T): boolean
{
    return x > y;
}

@inline
export function greater_equal<T>(x: T, y: T): boolean
{
    return x >= y;
}