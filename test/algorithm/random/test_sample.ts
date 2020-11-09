import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";
import { Comparator } from "../../../internal/functional/Comparator";
import { generate_incremental_vector } from "../../internal/generate_incremental_vector";

export function test_sample(): void
{
    StopWatch.measure("test_sample", () =>
    {
        const population: std.Vector<i32> = generate_incremental_vector(1000);
        for (let r: usize = 0; r < 100; ++r)
        {
            const length: usize = std.randint<usize>(10, 500);
            const sample: std.Vector<i32> = new std.Vector();

            sample.reserve(length);
            std.sample<std.Vector.Iterator<i32>, std.BackInsertIterator<std.Vector<i32>, i32>>
                (population.begin(), population.end(), std.back_inserter<std.Vector<i32>, i32>(sample), length);

            const unique: std.TreeSet<i32> = new std.TreeSet();
            for (let i: usize = 0; i < sample.size(); ++i)
                unique.insert(sample.at(i));

            if (unique.size() !== length)
                throw new Error("Bug on sample(): sampled elements are not unique.");
        }

        const all: std.Vector<i32> = new std.Vector();
        all.reserve(population.size());
        std.sample<std.Vector.Iterator<i32>, std.BackInsertIterator<std.Vector<i32>, i32>>
            (population.begin(), population.end(), std.back_inserter<std.Vector<i32>, i32>(all), population.size());

        std.sort<std.Vector.Iterator<i32>, Comparator<i32>>
            (all.begin(), all.end(), (x, y) => std.less(x, y));

        const same: boolean = std.equal<std.Vector.Iterator<i32>, std.Vector.Iterator<i32>, Comparator<i32>>
            (population.begin(), population.end(), all.begin(), (x, y) => x === y);
        if (same === false)
            throw new Error("Bug on sample(): be error when length of the sample is same with the origin population.");
    });
}