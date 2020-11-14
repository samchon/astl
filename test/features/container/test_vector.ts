import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_linear_base } from "./internal/test_linear_base";

export function test_vector(): void
{
    StopWatch.measure("test_vector", () =>
    {
        test_linear_base<std.Vector<i32>, std.Vector.Iterator<i32>, std.Vector.ReverseIterator<i32>>();
    });
}