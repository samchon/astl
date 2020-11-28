import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { test_multi_tree_container_base } from "../../container/internal/test_multi_tree_container_base";

export function test_flat_multi_set(): void
{
    StopWatch.measure("test_flat_multi_set", () =>
    {
        test_multi_tree_container_base<std.experimental.FlatTreeMultiSet<i32>, std.experimental.FlatMultiSet.Iterator<i32>>
        (
            (source, key) => source.insert(key),
            it => it.value,
            it => it.value
        );
    });
}