import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_unique_tree_container_base } from "./internal/test_unique_tree_container_base";

export function test_tree_set(): void
{
    StopWatch.measure("test_tree_set", () =>
    {
        test_unique_tree_container_base<std.TreeSet<i32>, std.TreeSet.Iterator<i32>>
        (
            (source, key) => source.insert(key),
            it => it.value,
            it => it.value
        );
    });
}