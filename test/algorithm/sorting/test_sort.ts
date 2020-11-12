import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";

function less(x: i32, y: i32): boolean
{
    return x < y;
}

function is_sorted(container: std.Vector<i32>): boolean
{
    for (let i: usize = 1; i < container.size(); ++i)
        if (container.at(i-1) > container.at(i))
            return false;
    return true;
}

export function test_sort(): void
{
    StopWatch.measure("test_sort", () =>
    {
        // RANDOM ELEMENTS
        const container: std.Vector<i32> = new std.Vector();
        container.reserve(1000);

        for (let i: i32 = 0; i < 1000; ++i)
            container.push_back(i);

        std.shuffle(container.begin(), container.end());
        if (is_sorted(container) === true)
            throw new Error("Bug on shuffle(): the elements are not shuffled.");

        // DO SORT
        std.sort(container.begin(), container.end(), less);
        if (is_sorted(container) === false)
            throw new Error("Bug on sort(): the elements are not sorted.");
    });
}