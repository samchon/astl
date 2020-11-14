import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";

class Capsule
{
    public readonly uid: usize;
    public readonly value: i32;

    public constructor(uid: usize, value: i32)
    {
        this.uid = uid;
        this.value = value;
    }
}

function is_sorted(container: std.Vector<Capsule>): boolean
{
    for (let i: usize = 1; i < container.size(); ++i)
        if (container.at(i-1).value > container.at(i).value)
            return false;
    return true;
}

export function test_stable_sort(): void
{
    StopWatch.measure("test_stable_sort", () =>
    {
        // CONSTRUCT CAPSULED ELEMENTS
        const container: std.Vector<Capsule> = new std.Vector();
        container.reserve(1000);

        let sequence: usize = 0;
        for (let i: i32 = 0; i < 50; ++i)
            for (let j: i32 = 0; j < 20; ++j)
                container.push_back(new Capsule(++sequence, i));
        
        // DO SORT
        std.stable_sort<std.Vector.Iterator<Capsule>, (x: Capsule, y: Capsule) => boolean>
        (
            container.begin(), 
            container.end(), 
            (x, y) => x.value < y.value
        );
        if (is_sorted(container) === false)
            throw new Error("Bug on stable_sort(): the elements are not sorted.");
    });
}