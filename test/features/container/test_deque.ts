import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_linear_base } from "./internal/test_linear_base";

export function test_deque(): void
{
    StopWatch.measure("test_deque", () =>
    {
        test_linear_base<std.Deque<i32>, std.Deque.Iterator<i32>, std.Deque.ReverseIterator<i32>>();
    });
}