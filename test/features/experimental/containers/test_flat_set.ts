import std from "../../../../index";
import { StopWatch } from "../../../internal/StopWatch";

export function test_flat_set(): void
{
    StopWatch.measure("test_flat_set", () =>
    {
        // INSERTIONS
        const container: std.experimental.FlatSet<i32> = new std.experimental.FlatSet();
        for (let i: i32 = 0; i < 1000; i += 10)
            for (let j: i32 = 0; j < 4; ++j)
            {
                const tuple: std.Pair<std.experimental.FlatSet.Iterator<i32>, boolean> = container.insert(i);
                if (!j !== tuple.second)
                    throw new Error("Bug on experimental.FlatSet.emplace(): must be " + (!j).toString() + " but " + tuple.second.toString());
            }
        if (container.size() !== 100)
            throw new Error("Bug on experimental.FlatSet.size(): must be 100 but " + container.size().toString());

        for (let i: i32 = 0; i < 1000; ++i)
        {
            // FIND BY KEY
            const it: std.experimental.FlatSet.Iterator<i32> = container.find(i);
            const exists: boolean = it != container.end();

            const must: boolean = (i % 10) === 0;
            if (must !== exists)
                throw new Error("Bug on experimental.FlatSet.find(): experimental.FlatSet.find(" + i.toString() + ") !== experimental.FlatSet.end(): must be " + must.toString() + " but " + exists.toString());

            // BOUNDERS
            const tuple: std.Pair<std.experimental.FlatSet.Iterator<i32>, std.experimental.FlatSet.Iterator<i32>> = container.equal_range(i);
            if (must === true && tuple.first.value !== i)
                throw new Error("Bug on experimental.FlatSet.lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + tuple.first.value.toString());
            else if (must === false && tuple.first != container.end() && tuple.first.value <= i)
                throw new Error("Bug on experimental.FlatSet.lower_bound(" + i.toString() + "): must be greater than " + i.toString());
            else if (tuple.second != container.end() && tuple.second.value <= i)
                throw new Error("Bug on experimental.FlatSet.upper_bound(" + i.toString() + "): must be greater than " + i.toString());
        }

        // IS SORTED
        let prev: i32 = -1;
        for (let it = container.begin(); it != container.end(); it = it.next())
        {
            if (it.value <= prev)
                throw new Error("Bug on experimental.FlatSet: elements are not sorted.");
            prev = it.value;
        }
    });
}