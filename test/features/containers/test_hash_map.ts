import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { test_unique_hash_container_base } from "./internal/test_unique_hash_container_base";

export function test_hash_map(): void
{
    StopWatch.measure("test_hash_map", () =>
    {
        test_unique_hash_container_base<std.HashMap<i32, i32>, std.HashMap.Iterator<i32, i32>>
        (
            (container, key, value) => container.emplace(key, value),
            it => it.first,
            it => it.second
        );
    });
}