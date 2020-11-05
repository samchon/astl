import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_queue(): void
{
    StopWatch.measure("test_queue", () =>
    {
        const adaptor: std.Queue<i32> = new std.Queue();
        for (let i: i32 = 0; i < 1000; ++i)
            adaptor.push(i);

        let top: i32 = adaptor.front();
        adaptor.pop();

        while (adaptor.empty() === false)
        {
            const elem: i32 = adaptor.front();
            if (elem <= top)
                throw new Error("Bug on Queue.top(): invalid algorithm.");

            top = elem;
            adaptor.pop();
        }
    });
}