import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { generate_multiples_of_te_vector } from "../../../internal/generate_multiples_of_ten_vector";

export function test_binary_search(): void
{
    StopWatch.measure("test_binary_search", () =>
    {
        const elements: std.Vector<i32> = generate_multiples_of_te_vector();
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const found: boolean = std.binary_search
                <std.Vector.Iterator<i32>, i32, (x: i32, y: i32) => boolean>
            (
                elements.begin(), 
                elements.end(), 
                i, 
                (x: i32, y: i32) => std.less(x, y)
            );
            if (found !== (i % 10 === 0))
                throw new Error("Bug on binary_search(): not exact.");
        }
    });
}