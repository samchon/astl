import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_unique_tree_container_base } from "./internal/test_unique_tree_container_base";

export function test_tree_map(): void
{
    StopWatch.measure("test_tree_map", () => 
    {
        test_unique_tree_container_base<std.TreeMap<i32, i32>, std.TreeMap.Iterator<i32, i32>>
        (
            (source, key, value) => source.emplace(key, value),
            it => it.first,
            it => it.second
        );
    });
}