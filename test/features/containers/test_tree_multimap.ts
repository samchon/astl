import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_tree_multimap(): void
{
    StopWatch.measure("test_tree_multimap", () =>
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
        const container: std.TreeMultiMap<i32, usize> = new std.TreeMultiMap();    
        while (elements.length !== 0)
        {
            const index: i32 = std.randint<i32>(0, elements.length - 1);
            const value: i32 = elements[index];

            container.emplace(value, container.count(value));
            elements.splice(index, 1);
        }
        
        // VALIDATE SIZE
        if (container.size() !== 400)
            throw new Error("Bug on TreeMultiMap.size(): must be 100 but " + container.size().toString());

        //----
        // ITERATIONS
        //----
        for (let i: i32 = 0; i < 1000; ++i)
        {
            // FIND BY KEY
            const it: std.TreeMultiMap.Iterator<i32, usize> = container.find(i);
            const exists: boolean = it != container.end();

            const must: boolean = (i % 10) === 0;
            if (must !== exists)
                throw new Error("Bug on TreeMultiMap.find(): TreeMultiMap.find(" + i.toString() + ") !== TreeMultiMap.end(): must be " + must.toString() + " but " + exists.toString());

            // BOUNDERS
            const tuple: std.Pair<std.TreeMultiMap.Iterator<i32, usize>, std.TreeMultiMap.Iterator<i32, usize>> = container.equal_range(i);
            if (must === true && tuple.first.first !== i)
                throw new Error("Bug on TreeMultiMap.lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + tuple.first.first.toString());
            else if (must === false && tuple.first != container.end() && tuple.first.first <= i)
                throw new Error("Bug on TreeMultiMap.lower_bound(" + i.toString() + "): must be greater than " + i.toString());
            else if (tuple.second != container.end() && tuple.second.first <= i)
                throw new Error("Bug on TreeMultiMap.upper_bound(" + i.toString() + "): must be greater than " + i.toString());

            
            if (must === false)
                continue;
            
            // COUNT
            const count: usize = container.count(i);
            if (count !== 4)
                throw new Error("Bug on TreeMultiMap.count(" + i.toString() + "): must be 4 but " + count.toString());

            let index: usize = 0;
            let sum: usize = 0;

            for (let x = container.lower_bound(i); x != container.end(); x = x.next())
            {
                if (x.first !== i)
                    break;
                else if (x.second !== index)
                    throw new Error("Bug on TreeMultiMap.lower_bound(" + i.toString() + "): insertion sequence is not kept.");

                sum += ++index;
            }
            if (sum !== 10)
                throw new Error("Bug on TreeMultiMap.lower_bound(" + i.toString() + "): the lowever_bound doesn't start from the first inserted item.");
        }

        // IS SORTED
        let prev: i32 = -1;
        for (let it = container.begin(); it != container.end(); it = it.next())
        {
            if (it.first < prev)
                throw new Error("Bug on TreeMultiMap: elements are not sorted.");
            prev = it.first;
        }
    });
}