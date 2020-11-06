import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_tree_multi_set(): void
{
    StopWatch.measure("test_tree_multi_set", () =>
    {
        //----
        // INSERTIONS
        //----
        // LIST UP ELEMENTS
        const elements: Array<i32> = [];
        for (let i: i32 = 0; i < 1000; i += 10)
            for (let j: i32 = 0; j < 4; ++j)
                elements.push(i);
        
        // RANDOM SHUFFLE
        const container: std.TreeMultiSet<i32> = new std.TreeMultiSet();
        while (elements.length !== 0)
        {
            const index: i32 = std.randint<i32>(0, elements.length - 1);
            const value: i32 = elements[index];

            container.insert(value);
            elements.splice(index, 1);
        }
        
        // VALIDATE SIZE
        if (container.size() !== 400)
            throw new Error("Bug on TreeMultiSet.size(): must be 100 but " + container.size().toString());

        //----
        // ITERATIONS
        //----
        for (let i: i32 = 0; i < 1000; ++i)
        {
            // FIND BY KEY
            const it: std.TreeMultiSet.Iterator<i32> = container.find(i);
            const exists: boolean = it != container.end();

            const must: boolean = (i % 10) === 0;
            if (must !== exists)
                throw new Error("Bug on TreeMultiSet.find(): TreeMultiSet.find(" + i.toString() + ") !== TreeMultiSet.end(): must be " + must.toString() + " but " + exists.toString());

            // BOUNDERS
            const tuple: std.Pair<std.TreeMultiSet.Iterator<i32>, std.TreeMultiSet.Iterator<i32>> = container.equal_range(i);
            if (must === true && tuple.first.value !== i)
                throw new Error("Bug on TreeMultiSet.lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + tuple.first.value.toString());
            else if (must === false && tuple.first != container.end() && tuple.first.value <= i)
                throw new Error("Bug on TreeMultiSet.lower_bound(" + i.toString() + "): must be greater than " + i.toString());
            else if (tuple.second != container.end() && tuple.second.value <= i)
                throw new Error("Bug on TreeMultiSet.upper_bound(" + i.toString() + "): must be greater than " + i.toString());

            if (must === false)
                continue;

            // COUNT
            const count: usize = container.count(i);
            if (count !== 4)
                throw new Error("Bug on TreeMultiSet.count(" + i.toString() + "): must be 4 but " + count.toString());

            let sum: usize = 0;
            for (let x = container.lower_bound(i); x != container.end(); x = x.next())
            {
                if (x.value !== i)
                    break;
                ++sum;
            }
            if (sum !== 4)
                throw new Error("Bug on TreeMultiSet.lower_bound(" + i.toString() + "): the lowever_bound doesn't start from the first inserted item.");
        }

        // IS SORTED
        let prev: i32 = -1;
        for (let it = container.begin(); it != container.end(); it = it.next())
        {
            if (it.value < prev)
                throw new Error("Bug on TreeMultiSet: elements are not sorted.");
            prev = it.value;
        }
    });
}