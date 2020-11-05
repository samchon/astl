export function hash<T>(obj: T): usize
{
    if (isInteger(obj) || isFloat(obj) || isBoolean(obj))
        return hash_by_string(obj);
    else if (isString(obj))
        return hash_string(<string>obj);
    else if (isReference(obj))
        return hash_by_string(changetype<usize>(obj));
    else
        return 0;
}

@inline()
function hash_by_string<T extends IStringable>
    (value: T): usize
{
    return hash_string(value.toString());
}

function hash_string(str: string): usize
{
    let ret: usize = INIT_VALUE;
    for (let i: i32 = 0; i < str.length; ++i)
    {
        ret ^= str.charCodeAt(i);
        ret *= MULTIPLIER;
    }
    return ret;
}

const INIT_VALUE: usize = 2166136261;
const MULTIPLIER: usize = 16777619;

interface IStringable
{
    toString(): string;
}