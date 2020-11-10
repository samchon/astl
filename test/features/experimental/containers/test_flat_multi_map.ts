import std from "../../../../index";
import { StopWatch } from "../../../internal/StopWatch";

export function test_flat_multi_map(): void
{
    StopWatch.measure("test_flat_multi_map", () =>
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
        const container: std.experimental.FlatMultiMap<i32, usize> = new std.experimental.FlatMultiMap();    
        while (elements.length !== 0)
        {
            const index: i32 = std.randint<i32>(0, elements.length - 1);
            const value: i32 = elements[index];

            container.emplace(value, container.count(value));
            elements.splice(index, 1);
        }
        
        // VALIDATE SIZE
        if (container.size() !== 400)
            throw new Error("Bug on experimental.FlatMultiMap.size(): must be 100 but " + container.size().toString());

        //----
        // ITERATIONS
        //----
        for (let i: i32 = 0; i < 1000; ++i)
        {
            // FIND BY KEY
            const it: std.experimental.FlatMultiMap.Iterator<i32, usize> = container.find(i);
            const exists: boolean = it != container.end();

            const must: boolean = (i % 10) === 0;
            if (must !== exists)
                throw new Error("Bug on experimental.FlatMultiMap.find(): experimental.FlatMultiMap.find(" + i.toString() + ") !== experimental.FlatMultiMap.end(): must be " + must.toString() + " but " + exists.toString());

            // BOUNDERS
            const tuple: std.Pair<std.experimental.FlatMultiMap.Iterator<i32, usize>, std.experimental.FlatMultiMap.Iterator<i32, usize>> = container.equal_range(i);
            if (must === true && tuple.first.first !== i)
                throw new Error("Bug on experimental.FlatMultiMap.lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + tuple.first.first.toString());
            else if (must === false && tuple.first != container.end() && tuple.first.first <= i)
                throw new Error("Bug on experimental.FlatMultiMap.lower_bound(" + i.toString() + "): must be greater than " + i.toString());
            else if (tuple.second != container.end() && tuple.second.first <= i)
                throw new Error("Bug on experimental.FlatMultiMap.upper_bound(" + i.toString() + "): must be greater than " + i.toString());

            
            if (must === false)
                continue;
            
            // COUNT
            const count: usize = container.count(i);
            if (count !== 4)
                throw new Error("Bug on experimental.FlatMultiMap.count(" + i.toString() + "): must be 4 but " + count.toString());

            let index: usize = 0;
            let sum: usize = 0;

            for (let x = container.lower_bound(i); x != container.end(); x = x.next())
            {
                if (x.first !== i)
                    break;
                else if (x.second !== index)
                    throw new Error("Bug on experimental.FlatMultiMap.lower_bound(" + i.toString() + "): insertion sequence is not kept.");

                sum += ++index;
            }
            if (sum !== 10)
                throw new Error("Bug on experimental.FlatMultiMap.lower_bound(" + i.toString() + "): the lowever_bound doesn't start from the first inserted item.");
        }

        // IS SORTED
        let prev: i32 = -1;
        for (let it = container.begin(); it != container.end(); it = it.next())
        {
            if (it.first < prev)
                throw new Error("Bug on experimental.FlatMultiMap: elements are not sorted.");
            prev = it.first;
        }
    });
}