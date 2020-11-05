import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_hash_set(): void
{
    StopWatch.measure("test_hash_set", () =>
    {
        // INSERTIONS
        const container: std.HashSet<i32> = new std.HashSet(x => x, (x, y) => x === y);
        for (let i: i32 = 0; i < 1000; ++i)
            for (let j: i32 = 0; j < 4; ++j)
            {
                const tuple: std.Pair<std.HashSet.Iterator<i32>, boolean> = container.insert(i);
                if (!j !== tuple.second)
                    throw new Error("Bug on HashSet.insert(): must be " + (!j).toString() + " but " + tuple.second.toString());
            }
        if (container.size() !== 1000)
            throw new Error("Bug on HashSet.size(): must be 1000 but " + container.size().toString());

        // FIND INSERTED ELEMENTS
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const it: std.HashSet.Iterator<i32> = container.find(i);
            if (it == container.end())
                throw new Error("Bug on HashSet.find(" + i.toString() + "): key exists, but failed to find it.");
            else if (it.value !== i)
                throw new Error("Bug on HashSet.find(" + i.toString() + "): it.value must be not " + it.value.toString() + " but " + i.toString());
        }

        // FIND UN-INSERTED ELEMENTS
        for (let i: i32 = 1000; i < 2000; ++i)
        {
            const it: std.HashSet.Iterator<i32> = container.find(i);
            if (it != container.end())
                throw new Error("Bug on HashSet.find(" + i.toString() + "): key does not exist, but succeeded to find something - " + it.value.toString());
        }

        // WHETHER INSERTION ORDER BE KEPT OR NOT
        let previous: i32 = container.begin().value;
        for (let it = container.begin().next(); it != container.end(); it = it.next())
        {
            if (it.value <= previous)
                throw new Error("Bug on HashSet.insert(): insertion order has not been kept.");
            previous = it.value;
        }
    });
}