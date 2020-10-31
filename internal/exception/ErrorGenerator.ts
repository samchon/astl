import { OutOfRange } from "../../exception/OutOfRange";

export namespace ErrorGenerator
{
    @inline()
    export function empty(instance: string): OutOfRange
    {
        return new OutOfRange("Error on " + instance + ": it's empty container.");
    }

    @inline()
    export function excessive(instance: string, index: usize, size: usize): OutOfRange
    {
        return new OutOfRange("Error on " + instance + ": parametric index is equal or greator than its size -> (index: " + index.toString() + ", size: " + size.toString() + ")");
    }

    @inline()
    export function key_nout_found<Key>(instance: string, key: Key): OutOfRange
    {
        return new OutOfRange("Error on " + instance + ": unable to find the matched key.");
    }
}