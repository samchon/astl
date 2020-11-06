import { Vector } from "../container/Vector";

import { CMath } from "../internal/numeric/CMath";
import { advance, distance } from "../iterator/global";
import { sort } from "./sorting";

@inline()
export function randint<T>(x: T, y: T): T
{
    const value: f64 = Math.round(Math.random() * (y - x));
    return <T>value;
}

export function sample<InputIterator, OutputIterator>
    (
        first: InputIterator, last: InputIterator,
        output: OutputIterator, n: usize
    ): OutputIterator
{
    // GENERATE REMAINDERS
    const step: usize = distance(first, last);
    const remainders: usize[] = [];

    for (let i: number = 0; i < step; ++i)
        remainders.push(i);

    //----
    // CONSTRUCT INDEXES
    //----
    const advances: Vector<usize> = new Vector();
    n = CMath.min(n, step);

    // PICK SAMPLE INDEXES
    for (let i: usize = 0; i < n; ++i)
    {
        const index: usize = randint<usize>(0, <usize>remainders.length - 1);
        advances.push_back(remainders.splice(index, 1)[0]);
    }
    sort<Vector.Iterator<usize>, (x: usize, y: usize) => boolean, usize>(advances.begin(), advances.end(), (x, y) => x < y);

    // CHANGE INDEXES TO ADVANCES
    for (let i: isize = n - 1; i >= 1; --i)
        advances.set(i, advances.at(i) - advances.at(i - 1));

    //----
    // FILL SAMPLES
    //----
    for (let i: usize = 0; i < advances.size(); ++i)
    {
        first = advance(first, advances.at(i));

        output.value = first.value;
        output = output.next();
    }
    return output;
}