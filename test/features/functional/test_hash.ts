import std from "../../../index";
import { StopWatch } from "../../internal/StopWatch";

export function test_hash(): void
{
    StopWatch.measure("test_hash", () =>
    {
        const theNull: std.Vector<i32> | null = null;
        const valueList: usize[] = [
            std.hash(<i8>-1),
            std.hash(<u16>3),
            std.hash(<f64>5),
            std.hash("something"),
            std.hash(new Object()),
            std.hash(new std.Vector<i32>()),
            std.hash(test_hash),
            std.hash(new Array<i32>()),
            std.hash(theNull)
        ];
        for (let i: i32 = 0; i < valueList.length; ++i)
            if (valueList[i] === 0)
                throw new Error("Bug on hash(): there's a type cannot handle.");
    });
}