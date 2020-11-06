import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_hash_multi_map(): void
{
    StopWatch.measure("test_hash_multi_map", () =>
    {
        // INSERTIONS
        const container: std.HashMultiMap<i32, i32> = new std.HashMultiMap(x => x, (x, y) => x === y);
        for (let k: i32 = 0; k < 4; ++k)
            for (let i: i32 = 0; i < 1000; ++i)
                container.emplace(i, i + k);

        if (container.size() !== 4000)
            throw new Error("Bug on HashMultiMap.size(): must be 4000 but " + container.size().toString());

        // FIND INSERTED ELEMENTS
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const it: std.HashMultiMap.Iterator<i32, i32> = container.find(i);
            const count: usize = container.count(i);

            if (it == container.end())
                throw new Error("Bug on HashMultiMap.find(" + i.toString() + "): key exists, but failed to find it.");
            else if (it.first !== i)
                throw new Error("Bug on HashMultiMap.find(" + i.toString() + "): it.first must be not " + it.first.toString() + " but " + i.toString());
            else if (it.second !== i)
                throw new Error("Bug on HashMultiMap.find(" + i.toString() + "): it.second must be not " + it.second.toString() + " but " + i.toString());
            else if (count !== 4)
                throw new Error("Bug on HashMultiMap.count(" + i.toString() + "): must be not " + count.toString() + " but 4");
        }

        // FIND UN-INSERTED ELEMENTS
        for (let i: i32 = 1000; i < 2000; ++i)
        {
            const it: std.HashMultiMap.Iterator<i32, i32> = container.find(i);
            if (it != container.end())
                throw new Error("Bug on HashMultiMap.find(" + i.toString() + "): key does not exist, but succeeded to find something - " + it.first.toString());
        }

        // WHETHER INSERTION ORDER BE KEPT OR NOT
        let it: std.HashMultiMap.Iterator<i32, i32> = container.begin();
        for (let k: i32 = 0; k < 4; ++k)
        {
            let previous: i32 = it.first;
            for (let i: i32 = 0; i < 999; ++i)
            {
                it = it.next();
                if (it.first <= previous)
                    throw new Error("Bug on HashMultiMap.emplace(): insertion order has not been kept.");
                else if (it.second !== i + 1 + k)
                    throw new Error("Bug on HashMultiMap.emplace(): second must be not " + it.second.toString() + " but " + (i + 1 + k).toString());
            }
            it = it.next();
        }
    });
}