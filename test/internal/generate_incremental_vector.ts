import std from "../../index";

export function generate_incremental_vector(limit: i32): std.Vector<i32>
{
    const ret: std.Vector<i32> = new std.Vector();
    ret.reserve(<usize>limit);

    for (let i: i32 = 0; i < limit; ++i)
        ret.push_back(i);

    return ret;
}