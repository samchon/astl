import std from "../../../index";
import { BenchmarkUtil } from "../../internal/BenchmarkUtil";

const hash: std.HashSet<string> = new std.HashSet();
const native: Set<string> = new Set();

const LIMIT: usize = 1000000;

function measure_insert(): string
{
    return BenchmarkUtil.measure("insert", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                hash.insert(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                native.add(i.toString());
        }
    ]);
}

function measure_has(): string
{
    return BenchmarkUtil.measure("has", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                hash.has(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                native.has(i.toString());
        }
    ]);
}

function measure_iteration(): string
{
    return BenchmarkUtil.measure("iteration", 
    [
        () =>
        {
            for (let it = hash.begin(); it != hash.end(); it = it.next())
                it.value;
        },
        () =>
        {
            const values: string[] = native.values();
            for (let i: i32 = 0; i < values.length; ++i)
                native.has(values[i]);
        }
    ]);
}

function measure_erase(): string
{
    return BenchmarkUtil.measure("erase", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                hash.erase_by_key(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                native.delete(i.toString());
        }
    ]);
}

export function benchmark_sets(): string
{
    return "### Set Containers\n"
        + " Method | HashSet<string> | Set<string> \n"
        + "--------|----------------:|------------:\n"
        + measure_insert() + "\n"
        + measure_has() + "\n"
        + measure_iteration() + "\n"
        + measure_erase() + "\n";
}