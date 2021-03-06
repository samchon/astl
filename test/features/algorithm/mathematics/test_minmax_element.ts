import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { Comparator } from "../../../../internal/functional/Comparator";
import { generate_incremental_vector } from "../../../internal/generate_incremental_vector";

export function test_minmax_element(): void
{
    StopWatch.measure("test_minmax_element", () =>
    {
        const elements: std.Vector<i32> = generate_incremental_vector(1000);
        std.shuffle<std.Vector.Iterator<i32>>(elements.begin(), elements.end());

        const tuple: std.Pair<std.Vector.Iterator<i32>, std.Vector.Iterator<i32>> = 
            std.minmax_element<std.Vector.Iterator<i32>, Comparator<i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));

        if (tuple.first.value !== 0 || tuple.second.value !== 999)
            throw new Error("Bug on minmax_element()");
    });
}