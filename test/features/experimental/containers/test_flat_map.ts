import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { test_unique_tree_container_base } from "../../containers/internal/test_unique_tree_container_base";

export function test_flat_map(): void
{
    StopWatch.measure("test_flat_map", () =>
    {
        test_unique_tree_container_base<std.experimental.FlatMap<i32, i32>, std.experimental.FlatMap.Iterator<i32, i32>>
        (
            (source, key, value) => source.emplace(key, value),
            it => it.first,
            it => it.second
        );
    });
}