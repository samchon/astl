import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { generate_multiples_of_te_vector } from "../../internal/generate_multiples_of_ten_vector";

export function test_lower_bound(): void
{
    StopWatch.measure("test_lower_bound", () =>
    {
        const elements: std.Vector<i32> = generate_multiples_of_te_vector();
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const it: std.Vector.Iterator<i32> = std.lower_bound
                <std.Vector.Iterator<i32>, i32, (x: i32, y: i32) => boolean>
            (
                elements.begin(), 
                elements.end(), 
                i, 
                (x: i32, y: i32) => std.less(x, y)
            );
            if (i % 10 === 0 && it.value !== i)
                throw new Error("Bug on lower_bound(): must be " + i.toString() + " but " + it.value.toString());
            else if (i % 10 !== 0 && it.value <= i)
                throw new Error("Bug on lower_bound(): must be greater than its parametric value when near value has been searched.");
        }
    });
}