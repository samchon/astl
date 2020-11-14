import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { test_unique_tree_container_base } from "../../container/internal/test_unique_tree_container_base";

export function test_flat_set(): void
{
    StopWatch.measure("test_flat_set", () =>
    {
        test_unique_tree_container_base<std.experimental.FlatSet<i32>, std.experimental.FlatSet.Iterator<i32>>
        (
            (source, key) => source.insert(key),
            it => it.value,
            it => it.value
        );
    });
}