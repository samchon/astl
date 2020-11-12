import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_multi_hash_container_base } from "./internal/test_multi_hash_container_base";

export function test_hash_multi_set(): void
{
    StopWatch.measure("test_hash_multi_set", () =>
    {
        test_multi_hash_container_base<std.HashMultiSet<i32>, std.HashMultiSet.Iterator<i32>>
        (
            (container, key) => container.insert(key),
            it => it.value,
            it => it.value
        );
    });
}