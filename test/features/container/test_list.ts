import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_linear_base } from "./internal/test_linear_base";

export function test_list(): void
{
    StopWatch.measure("test_list", () =>
    {
        test_linear_base<std.List<i32>, std.List.Iterator<i32>, std.List.ReverseIterator<i32>>();
    });
}