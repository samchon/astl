import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_hash_multi_set(): void
{
    StopWatch.measure("test_hash_multi_set", () =>
    {
        // INSERTIONS
        const container: std.HashMultiSet<i32> = new std.HashMultiSet(x => x, (x, y) => x === y);
        for (let k: i32 = 0; k < 4; ++k)
            for (let i: i32 = 0; i < 1000; ++i)
                container.insert(i);

        if (container.size() !== 4000)
            throw new Error("Bug on HashMultiSet.size(): must be 4000 but " + container.size().toString());

        // FIND INSERTED ELEMENTS
        for (let i: i32 = 0; i < 1000; ++i)
        {
            const it: std.HashMultiSet.Iterator<i32> = container.find(i);
            const count: usize = container.count(i);

            if (it == container.end())
                throw new Error("Bug on HashMultiSet.find(" + i.toString() + "): key exists, but failed to find it.");
            else if (it.value !== i)
                throw new Error("Bug on HashMultiSet.find(" + i.toString() + "): it.value must be not " + it.value.toString() + " but " + i.toString());
            else if (count !== 4)
                throw new Error("Bug on HashMultiSet.count(" + i.toString() + "): must be not " + count.toString() + " but 4");
        }

        // FIND UN-INSERTED ELEMENTS
        for (let i: i32 = 1000; i < 2000; ++i)
        {
            const it: std.HashMultiSet.Iterator<i32> = container.find(i);
            if (it != container.end())
                throw new Error("Bug on HashMultiSet.find(" + i.toString() + "): key does not exist, but succeeded to find something - " + it.value.toString());
        }

        // WHETHER INSERTION ORDER BE KEPT OR NOT
        let it: std.HashMultiSet.Iterator<i32> = container.begin();
        for (let k: i32 = 0; k < 4; ++k)
        {
            let previous: i32 = it.value;
            for (let i: i32 = 0; i < 999; ++i)
            {
                it = it.next();
                if (it.value <= previous)
                    throw new Error("Bug on HashMultiSet.insert(): insertion order has not been kept.");    
            }
            it = it.next();
        }
    });
}