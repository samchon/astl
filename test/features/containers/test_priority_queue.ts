import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_priority_queue(): void
{
    StopWatch.measure("test_priority_queue", () =>
    {
        const adaptor: std.PriorityQueue<i32> = new std.PriorityQueue();
        
        // INSERT RANDOM ELEMENTS
        const elements: Array<i32> = [];
        for (let i: i32 = 0; i < 10; ++i)
            for (let j: i32 = 0; j < 4; ++j)
                elements.push(i);

        while (elements.length !== 0)
        {
            const index: i32 = std.randint<i32>(0, elements.length - 1);
            const value: i32 = elements[index];

            adaptor.push(value);
            elements.splice(index, 1);
        }

        // TEST WHETHER ELEMENTS ARE EXACTLY SORTED
        let previous: i32 = 1000;
        while (adaptor.empty() === false)
        {
            if (previous < adaptor.top())
                throw new Error("Bug on PriorityQueue: elements are not reversly sorted - " + previous.toString() + " < " + adaptor.top().toString());
            
            previous = adaptor.top();
            adaptor.pop();
        }
    });
}