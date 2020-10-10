import { OutOfRange } from "../../exception/OutOfRange";

export namespace ErrorGenerator
{
    @inline()
    export function empty(instance: string): void
    {
        throw new OutOfRange("Error on " + instance + ": it's empty container.");
    }

    @inline()
    export function excessive(instance: string, index: usize, size: usize): void
    {
        throw new OutOfRange("Error on " + instance + ": parametric index is equal or greator than its size -> (index: " + index.toString() + ", size: " + size.toString() + ")");
    }
}