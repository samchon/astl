import { remove_if } from "../../algorithm";
import { Deque } from "../../container";
import std from "../../index";
import { BenchmarkUtil } from "../internal/BenchmarkUtil";

const vector: std.Vector<usize> = new std.Vector();
const deque: std.Deque<usize> = new std.Deque();
let array: Array<usize> = [];

const LIMIT: usize = 10000000;

function measure_push(): string
{
    return BenchmarkUtil.measure("push", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                vector.push_back(i);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                deque.push_back(i);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                array.push(i);
        }
    ]);
}

function measure_reserve(): string
{
    vector.clear();
    deque.clear();
    array = [];

    return BenchmarkUtil.measure("reserve", 
    [
        () =>
        {
            vector.reserve(LIMIT);
            for (let i: usize = 0; i < LIMIT; ++i)
                vector.push_back(i);
        },
        () =>
        {
            Deque.reserve<usize>(deque, LIMIT);
            for (let i: usize = 0; i < LIMIT; ++i)
                deque.push_back(i);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                array.push(i);
        }
    ]);
}

const accessments: usize[] = [];
function measure_access(): string
{
    for (let i: usize = 0; i < LIMIT; ++i)
        accessments.push(std.randint<usize>(0, LIMIT - 1));

    return BenchmarkUtil.measure("access", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                vector.at(accessments[<i32>i]);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                deque.at(accessments[<i32>i]);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                array[<i32>accessments[<i32>i]];
        }
    ]);
}

const deletions: std.Pair<usize, usize>[] = [];
function measure_erase(): string
{
    let remainder: usize = LIMIT;
    while (remainder >= LIMIT / 3)
    {
        const first = std.randint<usize>(0, remainder - 1);
        const last = std.randint<usize>(first + 1, remainder);

        deletions.push(new std.Pair(first, last));
        remainder -= (last - first);
    }

    return BenchmarkUtil.measure("erase", 
    [
        () =>
        {
            for (let i: i32 = 0; i < deletions.length; ++i)
            {
                const tuple: std.Pair<usize, usize> = deletions[i];
                vector.erase(vector.nth(tuple.first), vector.nth(tuple.second));
                // vector._Erase(tuple.first, tuple.second);
            }
        },
        () =>
        {
            for (let i: i32 = 0; i < deletions.length; ++i)
            {
                const tuple: std.Pair<usize, usize> = deletions[i];
                deque.erase(deque.nth(tuple.first), deque.nth(tuple.second));
            }
        },
        () =>
        {
            for (let i: i32 = 0; i < deletions.length; ++i)
            {
                const tuple: std.Pair<usize, usize> = deletions[i];
                array.splice(<i32>tuple.first, <i32>(tuple.second - tuple.first));
            }
        }
    ]);
}

const insertions: usize[] = [];
function measure_insert(): string
{
    let size: usize = vector.size();
    let limit: usize = 100;

    for (let i: usize = 0; i < limit; ++i)
    {
        const index: usize = std.randint<usize>(0, size++);
        insertions.push(index);
    }

    return BenchmarkUtil.measure("insert", 
    [
        () =>
        {
            for (let i: i32 = 0; i < insertions.length; ++i)
            {
                const index: usize = insertions[i];
                vector.insert(vector.nth(index), 0);
            }
        },
        () =>
        {
            for (let i: i32 = 0; i < insertions.length; ++i)
            {
                const index: usize = insertions[i];
                deque.insert(deque.nth(index), 0);
            }
        },
        () =>
        {
            for (let i: i32 = 0; i < insertions.length; ++i)
            {
                const index: usize = insertions[i];
                array = array.slice(0, <i32>index).concat(array.slice(<i32>index + 1, array.length));
            }
        }
    ]);
}

export function benchmark_vector(): string
{
    return "## Array Containers\n"
        + " Method | Vector<i32> | Deque<i32> | Array<i32> \n"
        + "-----------|-------------|------------|------------\n"
        + measure_push() + "\n"
        + measure_reserve() + "\n"
        + measure_access() + "\n"
        + measure_erase() + "\n"
        + measure_insert() + "\n";
}