import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";

export function test_forward_list(): void
{
    StopWatch.measure("test_forward_list", () =>
    {
        const container: std.ForwardList<i32> = new std.ForwardList();
        for (let i: i32 = 9; i >= 0; --i)
            container.push_front(i);

        //----
        // ELEMENTS I/O
        //----
        let it: std.ForwardList.Iterator<i32> = std.advance(container.before_begin(), 3); // STEP TO 2
        it = container.erase_after(it); // AND ERASE 3 BY ERASE_AFTER()

        if (it.value !== 4)
            throw new Error("Bug on std.ForwardList.erase_after(); single deletion.");

        // INSERT AN ELEMENT
        it = std.advance(container.before_begin(), 2);
        it = container.insert_after(it, -1); // INSERT -1

        if (it.value !== -1)
            throw new Error("Bug on std.ForwardList.insert_after().");

        // ERASE RANGE
        it = std.advance(container.before_begin(), 6);
        it = container.erase_after(it, std.advance(it, 3+1));

        if (it.value !== 9)
            throw new Error("Bug on std.ForwardList.erase_after(); range deletion.");

        //----
        // FINAL VALIDATION
        //----
        const answer: i32[] = [0, 1, -1, 2, 4, 5, 9];
        let index: i32 = 0;

        for (let it = container.begin(); it != container.end(); it = it.next())
            if (it.value !== answer[index++])
                throw new Error("Bug on std.ForwardList; store elements are wrong.");
    });
}