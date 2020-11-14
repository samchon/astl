import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_unique_hash_container_base } from "./internal/test_unique_hash_container_base";

export function test_hash_set(): void
{
    StopWatch.measure("test_hash_set", () =>
    {
        test_unique_hash_container_base<std.HashSet<i32>, std.HashSet.Iterator<i32>>
        (
            (container, key) => container.insert(key),
            it => it.value,
            it => it.value
        );
    });
}