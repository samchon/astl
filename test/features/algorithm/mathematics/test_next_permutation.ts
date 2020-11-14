import std from "../../../../index";

import { StopWatch } from "../../../internal/StopWatch";
import { Comparator } from "../../../../internal/functional/Comparator";
import { generate_incremental_vector } from "../../../internal/generate_incremental_vector";

export function test_next_permutation(): void
{
    StopWatch.measure("test_next_permutation", () =>
    {
        const elements: std.Vector<i32> = generate_incremental_vector(6);
        
        const words: std.HashSet<string> = new std.HashSet();
        let count: usize = 0;
        
        do
        {
            let letter: string = "";
            for (let i: usize = 0; i < elements.size(); ++i)
                letter += elements.at(i).toString();

            words.insert(letter);
            ++count;
        }
        while (std.next_permutation<std.Vector.Iterator<i32>, Comparator<i32>>(elements.begin(), elements.end(), (x, y) => std.less(x, y)) === true);

        if (count !== <usize>720)
            throw new Error("Bug on next_permutation(): number of cases are wrong.")
        else if (count !== words.size())
            throw new Error("Bug on next_permutation(): same case has been occured.");
    });
}