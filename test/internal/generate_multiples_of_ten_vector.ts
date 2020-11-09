import std from "../../index";

export function generate_multiples_of_te_vector(): std.Vector<i32>
{
    const ret: std.Vector<i32> = new std.Vector();
    ret.reserve(100);

    for (let i: i32 = 0; i <= 1000; i += 10)
        ret.push_back(i);

    return ret;
}