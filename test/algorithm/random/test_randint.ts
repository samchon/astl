import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";

export function test_randint(): void
{
    StopWatch.measure("test_randint", () =>
    {
        for (let i: usize = 0; i < 10000; ++i)
        {
            const value: i32 = std.randint<i32>(-5, 5);
            if (value < -5 || value > 5)
                throw new Error("Bug on randint(): " + value.toString());
        }
    });
}