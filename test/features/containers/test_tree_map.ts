import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_tree_map(): void
{
    StopWatch.measure("test_tree_map", () =>
    {
        //----
        // INSERTIONS
        //----
        // LIST UP ELEMENTS
        const elements: Array<i32> = [];
        for (let i: i32 = 0; i < 1000; i += 10)
            elements.push(i);

        // RANDOM SHUFFLE
        const container: std.TreeMap<i32, i32> = new std.TreeMap();
        while (elements.length !== 0)
        {
            const index: i32 = std.randint<i32>(0, elements.length - 1);
            const value: i32 = elements[index];

            for (let j: i32 = 0; j < 4; ++j)
            {
                const lower = container.lower_bound(value);
                const tuple: std.Pair<std.TreeMap.Iterator<i32, i32>, boolean> = container.emplace(value, value + j);

                if (!j !== tuple.second)
                    throw new Error("Bug on TreeMap.emplace(" + value.toString() + ", " + (value + j).toString() + "): must be " + (!j).toString() + " but " + tuple.second.toString());
                else if (tuple.first.second !== value)
                    throw new Error("Bug on TreeMap.emplace(): must be failed to update the second value, but succeeded.");
            }
            elements.splice(index, 1);
        }

        // VALIDATE SIZE
        if (container.size() !== 100)
            throw new Error("Bug on TreeMap.size(): must be 100 but " + container.size().toString());

        //----
        // ITERATIONS
        //----
        for (let i: i32 = 0; i < 1000; ++i)
        {
            // FIND BY KEY
            const it: std.TreeMap.Iterator<i32, i32> = container.find(i);
            const exists: boolean = it != container.end();

            const must: boolean = (i % 10) === 0;
            if (must !== exists)
                throw new Error("Bug on TreeMap.find(): TreeMap.find(" + i.toString() + ") !== TreeMap.end(): must be " + must.toString() + " but " + exists.toString());

            // BOUNDERS
            const tuple: std.Pair<std.TreeMap.Iterator<i32, i32>, std.TreeMap.Iterator<i32, i32>> = container.equal_range(i);
            if (must === true && tuple.first.first !== i)
                throw new Error("Bug on TreeMap.lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + tuple.first.first.toString());
            else if (must === false && tuple.first != container.end() && tuple.first.first <= i)
                throw new Error("Bug on TreeMap.lower_bound(" + i.toString() + "): must be greater than " + i.toString());
            else if (tuple.second != container.end() && tuple.second.first <= i)
                throw new Error("Bug on TreeMap.upper_bound(" + i.toString() + "): must be greater than " + i.toString());
        }

        // IS SORTED
        let prev: i32 = -1;
        for (let it = container.begin(); it != container.end(); it = it.next())
        {
            if (it.first <= prev)
                throw new Error("Bug on TreeMap: elements are not sorted.");
            else if (it.first !== it.second)
                throw new Error("Bug on TreeMap: key and value must be same in this test program.");
            prev = it.first;
        }
    });
}