import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_stack(): void
{
    StopWatch.measure("test_stack", () =>
    {
        const adaptor: std.Stack<i32> = new std.Stack();
        for (let i: i32 = 0; i < 1000; ++i)
            adaptor.push(i);

        let top: i32 = adaptor.top();
        adaptor.pop();

        while (adaptor.empty() === false)
        {
            const elem: i32 = adaptor.top();
            if (elem >= top)
                throw new Error("Bug on Stack.top(): invalid algorithm.");

            top = elem;
            adaptor.pop();
        }
    });
}