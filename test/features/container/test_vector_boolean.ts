import std from "../../../index";

import { StopWatch } from "../../internal/StopWatch";

@inline()
function rand_bool(): boolean
{
    return Math.random() < .5;
}

function test_elements_io(): void
{
    // PREPARE CONTAINERS
    const v: std.Vector<boolean> = new std.Vector();
    const vb: std.VectorBoolean = new std.VectorBoolean();

    // INITIALIZE WITH 10 FALSES
    v.assign_repeatedly(10, false);
    vb.assign_repeatedly(10, false);

    // REPEAT INSERTIONS
    for (let i: usize = 0; i < 100; ++i)
    {
        const index: usize = std.randint<usize>(0, v.size());
        const length: usize = std.randint<usize>(1, 10);
        const value: boolean = rand_bool();

        v.insert_repeatedly(v.nth(index), length, value);
        vb.insert_repeatedly(vb.nth(index), length, value);
    }

    // REPEAT DELETIONS

}

function test_flip(): void
{
    const vb: std.VectorBoolean = new std.VectorBoolean();
    for (let i: i32 = 0; i < 100; ++i)
        vb.push_back(rand_bool());

    const cpy: std.VectorBoolean = new std.VectorBoolean();
    cpy.assign_range(vb.begin(), vb.end());
    cpy.flip();

    for (let i: usize = 0; i < vb.size(); ++i)
        if (vb.at(i) === cpy.at(i))
            throw new Error("Bug on VectorBoolean.flip(): not flipped.");
}

export function test_vector_boolean(): void
{
    StopWatch.measure("test_vector_boolean", () =>
    {
        test_elements_io();
        test_flip();
    });
}