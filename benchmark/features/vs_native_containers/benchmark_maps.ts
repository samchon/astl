import std from "../../../index";
import { BenchmarkUtil } from "../../internal/BenchmarkUtil";

const associative: std.HashMap<string, usize> = new std.HashMap();
const adaptive: std.experimental.LightMap<string, usize> = new std.experimental.LightMap();
const native: Map<string, usize> = new Map();

const LIMIT: usize = 1000000;

function measure_insert(): string
{
    return BenchmarkUtil.measure("insert", 
    [
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                associative.emplace(i.toString(), 0);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                adaptive.set(i.toString(), 0);
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                native.set(i.toString(), 0);
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
                associative.has(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; ++i)
                adaptive.has(i.toString());
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
            for (let it = associative.begin(); it != associative.end(); it = it.next())
                it.first;
        },
        () =>
        {
            for (let it = adaptive.begin(); it != adaptive.end(); it = it.next())
                it.first;
        },
        () =>
        {
            const keys: string[] = native.keys();
            for (let i: i32 = 0; i < keys.length; ++i)
                native.get(keys[i]);
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
                associative.erase_by_key(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                adaptive.erase_by_key(i.toString());
        },
        () =>
        {
            for (let i: usize = 0; i < LIMIT; i += 10)
                native.delete(i.toString());
        }
    ]);
}

export function benchmark_maps(): string
{
    return "### Map Containers\n"
        + " Method | HashMap<string, usize> | LightMap<string, usize> | Map<string, usize> \n"
        + "--------|-----------------------:|------------------------:|-------------------:\n"
        + measure_insert() + "\n"
        + measure_has() + "\n"
        + measure_iteration() + "\n"
        + measure_erase() + "\n";
}