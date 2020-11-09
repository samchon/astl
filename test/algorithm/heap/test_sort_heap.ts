import std from "../../../index";

import { Comparator } from "../../../internal/functional/Comparator";
import { StopWatch } from "../../internal/StopWatch";
import { generate_incremental_vector } from "../../internal/generate_incremental_vector";
import { is_sorted } from "../../../algorithm";

export function test_sort_heap(): void
{
    StopWatch.measure("test_sort_heap", () =>
    {
        const elements: std.Vector<i32> = generate_incremental_vector(100);
        std.shuffle(elements.begin(), elements.end());

        std.make_heap<std.Vector.Iterator<i32>, Comparator<i32, i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));
        std.sort_heap<std.Vector.Iterator<i32>, Comparator<i32, i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));

        const sorted: boolean = is_sorted<std.Vector.Iterator<i32>, Comparator<i32, i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));
        if (sorted === false)
            throw new Error("Bug on sort_heap(): elements are not sorted");
    });
}