import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_list(): void
{
    StopWatch.measure("test_list", () =>
    {
        // INSERT ELEMENTS
        const container: std.List<i32> = new std.List();
        for (let i: i32 = 0; i < 1000; ++i)
            container.push_back(i);

        // VALIDATE SIZE
        if (container.size() !== 1000)
            throw new Error("Bug on List.size(): size is not 1000, but " + container.size().toString());

        // VALIDATE ELEMENTS
        let sum: i32 = 0;
        for (let it = container.begin(); it != container.end(); it = it.next())
            sum += it.value;
        
        if (sum !== 999 * 1000 / 2)
            throw new Error("Bug on List's elements: sum of the elements are not " + (1000 * 1001 / 2).toString() + " but " + sum.toString());

        // ERASE 27
        let it = std.advance(container.begin(), 27);
        it = container.erase(it);

        if (it.value !== 28)
            throw new Error("Bug on List.erase(): must be 28 but " + it.value.toString());
        
        // INSERT AN ELEMENT
        it = std.advance(container.begin(), 271);
        it = container.insert(it, -1);

        if (it.value !== -1)
            throw new Error("Bug on List.insert(): must be -1 but " + it.value.toString());
        else if (it.next().value !== 272)
            throw new Error("Bug on List.insert().next(): must be 272 but " + it.value.toString());

        // ERASE RANGE
        it = std.advance(container.begin(), 680);
        it = container.erase(it, std.advance(it, 300)); // erase from 680 to 980

        if (it.value !== 980)
            throw new Error("Bug on List.erase(): must be 980 but " + it.value.toString());
        else if (container.size() !== 700)
            throw new Error("Bug on List.size(): must be 700 but " + container.size().toString());
    });
}