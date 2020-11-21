export function hash<T>(key: T): usize
{
    if (isString<T>())
        return hash_string(key);
    else if (isReference<T>())
    {
        if (sizeof<T>() === 4) return hash32(<usize>changetype<u32>(key));
        if (sizeof<T>() === 8) return hash64(<usize>changetype<u64>(key));
    }
    else if (isFloat<T>())
    {
        if (sizeof<T>() === 4) return hash32(<usize>reinterpret<u32>(f32(key)));
        if (sizeof<T>() === 8) return hash64(<usize>reinterpret<u64>(f64(key)));
    }
    else
    {
        if (sizeof<T>() === 1) return hash8(usize(key));
        if (sizeof<T>() === 2) return hash16(usize(key));
        if (sizeof<T>() === 4) return hash32(usize(key));
        if (sizeof<T>() === 8) return hash64(usize(key));
    }
    return 0;
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

function hash8(key: usize): usize
{
    return INIT_VALUE ^ key * MULTIPLIER;
}

function hash16(key: usize): usize
{
    let ret: usize = INIT_VALUE;
    ret = (ret ^ ( key        & 0xff)) * MULTIPLIER;
    ret = (ret ^ ( key >>  8        )) * MULTIPLIER;

    return ret;
}

function hash32(key: usize): usize
{
    let ret: usize = INIT_VALUE;
    ret = (ret ^ ( key        & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((key >>  8) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((key >> 16) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ( key >> 24        )) * MULTIPLIER;

    return ret;
}

function hash64(key: usize): usize
{
    // SEPARATE FOR 32 BITS SYSTEM
    const x: usize = key;
    const y: usize = (key >>> 32);

    var ret = INIT_VALUE;
    ret = (ret ^ ( x        & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((x >>  8) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((x >> 16) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ( x >> 24        )) * MULTIPLIER;
    ret = (ret ^ ( y        & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((y >>  8) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ((y >> 16) & 0xff)) * MULTIPLIER;
    ret = (ret ^ ( y >> 24        )) * MULTIPLIER;

    return ret;
}

@inline const INIT_VALUE: usize = 2166136261;
@inline const MULTIPLIER: usize = 16777619;