import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { Comparator } from "../../../internal/functional/Comparator";
import { generate_incremental_vector } from "../../internal/generate_incremental_vector";

export function test_min_element(): void
{
    StopWatch.measure("test_min_element", () =>
    {
        const elements: std.Vector<i32> = generate_incremental_vector(1000);
        std.shuffle<std.Vector.Iterator<i32>>(elements.begin(), elements.end());
        
        const min: std.Vector.Iterator<i32> = std.min_element<std.Vector.Iterator<i32>, Comparator<i32>>
            (elements.begin(), elements.end(), (x, y) => std.less(x, y));

        if (min.value !== 0)
            throw new Error("Bug on min_element()");
    });
}