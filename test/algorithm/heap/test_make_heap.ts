import std from "../../../index";

import { Comparator } from "../../../internal/functional/Comparator";
import { StopWatch } from "../../internal/StopWatch";
import { generate_incremental_vector } from "../../internal/generate_incremental_vector";

export function test_make_heap(): void
{
    StopWatch.measure("test_make_heap", () =>
    {
        const elements: std.Vector<i32> = generate_incremental_vector(100);
        std.shuffle(elements.begin(), elements.end());
        std.make_heap<std.Vector.Iterator<i32>, Comparator<i32, i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));

        const isHeap: boolean = std.is_heap<std.Vector.Iterator<i32>, Comparator<i32, i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));
        if (isHeap === false)
            throw new Error("Bug on make_heap(): not heap.");

        let previous: i32 = 1000;
        while (elements.empty() === false)
        {
            const top: i32 = elements.front();
            if (previous < top)
                throw new Error("Bug on make_heap(): poppped elements are not sorted.");

            previous = top;
            std.pop_heap<std.Vector.Iterator<i32>, Comparator<i32, i32>>
                (elements.begin(), elements.end(), (x, y) => std.less(x, y));
            elements.pop_back();
        }
    });
}