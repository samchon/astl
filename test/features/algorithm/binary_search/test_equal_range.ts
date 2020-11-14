import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { generate_multiples_of_te_vector } from "../../../internal/generate_multiples_of_ten_vector";

export function test_equal_range(): void
{
    StopWatch.measure("test_equal_range", () =>
    {
        const elements: std.Vector<i32> = generate_multiples_of_te_vector();
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const tuple: std.Pair<std.Vector.Iterator<i32>, std.Vector.Iterator<i32>> = std.equal_range
                <std.Vector.Iterator<i32>, i32, (x: i32, y: i32) => boolean>
            (
                elements.begin(), 
                elements.end(), 
                i, 
                (x: i32, y: i32) => std.less(x, y)
            );
            const lower: std.Vector.Iterator<i32> = tuple.first;
            const upper: std.Vector.Iterator<i32> = tuple.second;

            if (i % 10 === 0 && lower.value !== i)
                throw new Error("Bug on equal_range().first: must be " + i.toString() + " but " + lower.value.toString());
            else if (i % 10 !== 0 && lower.value <= i)
                throw new Error("Bug on equal_ragen().first: must be greater than its parametric value when near value has been searched.");
            else if (upper.value <= i)
                throw new Error("Bug on equal_range().second: must be greater than its parametric value.");
        }
    });
}