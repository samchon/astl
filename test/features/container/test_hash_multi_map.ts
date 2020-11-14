import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_multi_hash_container_base } from "./internal/test_multi_hash_container_base";

export function test_hash_multi_map(): void
{
    StopWatch.measure("test_hash_multi_map", () =>
    {
        test_multi_hash_container_base<std.HashMultiMap<i32, i32>, std.HashMultiMap.Iterator<i32, i32>>
        (
            (container, key, value) => container.emplace(key, value),
            it => it.first,
            it => it.second
        );
    });
}