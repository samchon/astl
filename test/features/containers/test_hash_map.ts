import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_hash_map(): void
{
    StopWatch.measure("test_hash_map", () =>
    {
        // INSERTIONS
        const container: std.HashMap<i32, i32> = new std.HashMap();
        for (let i: i32 = 0; i < 1000; ++i)
            for (let j: i32 = 0; j < 4; ++j)
            {
                const tuple: std.Pair<std.HashMap.Iterator<i32, i32>, boolean> = container.emplace(i, i + j);
                if (!j !== tuple.second)
                    throw new Error("Bug on HashMap.emplace(): must be " + (!j).toString() + " but " + tuple.second.toString());
                else if (tuple.first.second !== i)
                    throw new Error("Bug on HashMap.emplace(): must be failed to update the second value, but succeeded.");
            }
        if (container.size() !== 1000)
            throw new Error("Bug on HashMap.size(): must be 1000 but " + container.size().toString());

        // FIND INSERTED ELEMENTS
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const it: std.HashMap.Iterator<i32, i32> = container.find(i);
            if (it == container.end())
                throw new Error("Bug on HashMap.find(" + i.toString() + "): key exists, but failed to find it.");
            else if (it.first !== i)
                throw new Error("Bug on HashMap.find(" + i.toString() + "): it.first must be not " + it.first.toString() + " but " + i.toString());
            else if (it.second !== i)
                throw new Error("Bug on HashMap.find(" + i.toString() + "): it.second must be not " + it.second.toString() + " but " + i.toString());
        }

        // FIND UN-INSERTED ELEMENTS
        for (let i: i32 = 1000; i < 2000; ++i)
        {
            const it: std.HashMap.Iterator<i32, i32> = container.find(i);
            if (it != container.end())
                throw new Error("Bug on HashMap.find(" + i.toString() + "): key does not exist, but succeeded to find something - " + it.first.toString());
        }

        // WHETHER INSERTION ORDER BE KEPT OR NOT
        let previous: i32 = container.begin().first;
        for (let it = container.begin().next(); it != container.end(); it = it.next())
        {
            if (it.first <= previous)
                throw new Error("Bug on HashMap.emplace(): insertion order has not been kept.");
            previous = it.first;
        }
    });
}