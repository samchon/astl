import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_multi_tree_container_base } from "./internal/test_multi_tree_container_base";

export function test_tree_multi_set(): void
{
    StopWatch.measure("test_tree_multi_set", () =>
    {
        test_multi_tree_container_base<std.TreeMultiSet<i32>, std.TreeMultiSet.Iterator<i32>>
        (
            (source, key) => source.insert(key),
            it => it.value,
            it => it.value
        );
    });
}