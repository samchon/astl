import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { test_multi_tree_container_base } from "../../container/internal/test_multi_tree_container_base";

export function test_flat_multi_map(): void
{
    StopWatch.measure("test_flat_multi_map", () =>
    {
        test_multi_tree_container_base<std.experimental.FlatTreeMultiMap<i32, i32>, std.experimental.FlatMultiMap.Iterator<i32, i32>>
        (
            (source, key, value) => source.emplace(key, value),
            it => it.first,
            it => it.second
        );
    });
}