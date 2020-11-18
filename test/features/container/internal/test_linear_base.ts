import std from "../../../../index";

import { ILinearContainer, ILinearContainerIterator, ILinearContainerReverseIterator } from "../../../../internal/container/linear/ILinearContainer";
import { BinaryPredicator } from "../../../../internal/functional/BinaryPredicator";

function test_assign<ContainerT, IteratorT, ReverseT>(container: ContainerT): void
{
    const replica: ContainerT = instantiate<ContainerT>();
    // replica.assign<ReverseT>(container.rbegin(), container.rend());
    
    // const equal: boolean = std.equal<ReverseT, IteratorT, BinaryPredicator<i32, i32>>
    // (
    //     container.rbegin(), container.rend(), 
    //     replica.begin(), 
    //     (x, y) => x === y
    // );
    // if (equal === false)
    //     throw new Error("Bug on " + nameof<ContainerT>() + ".assign(): elements are not assigned exactly.");
}

export function test_linear_base<ContainerT, IteratorT, ReverseT>(): void
{
    // INSERT ELEMENTS
    const container: ContainerT = instantiate<ContainerT>();
    for (let i: i32 = 0; i < 1000; ++i)
        container.push_back(i);

    // VALIDATE SIZE
    if (container.size() !== 1000)
        throw new Error("Bug on " + nameof<ContainerT>() + ".size(): size is not 1000, but " + container.size().toString());

    // VALIDATE ELEMENTS
    let sum: i32 = 0;
    for (let it = container.begin(); it != container.end(); it = it.next())

        sum += it.value;
    if (sum !== 999 * 1000 / 2)
        throw new Error("Bug on " + nameof<ContainerT>() + "'s elements: sum of the elements are not " + (1000 * 1001 / 2).toString() + " but " + sum.toString());

    // ERASE 27
    let it: IteratorT = std.advance(container.begin(), 27);
    it = container.erase(it);

    if (it.value !== 28)
        throw new Error("Bug on " + nameof<ContainerT>() + ".erase(): must be 28 but " + it.value.toString());

    // INSERT AN ELEMENT
    it = std.advance(container.begin(), 271);
    it = container.insert(it, -1);

    if (it.value !== -1)
        throw new Error("Bug on " + nameof<ContainerT>() + ".insert(): must be -1 but " + it.value.toString());
    else if (it.next().value !== 272)
        throw new Error("Bug on " + nameof<ContainerT>() + ".insert().next(): must be 272 but " + it.value.toString());

    // ERASE RANGE
    it = std.advance(container.begin(), 680);
    it = container.erase(it, std.advance(it, 300)); // erase from 680 to 980

    if (it.value !== 980)
        throw new Error("Bug on " + nameof<ContainerT>() + ".erase(): must be 980 but " + it.value.toString());
    else if (container.size() !== 700)
        throw new Error("Bug on " + nameof<ContainerT>() + ".size(): must be 700 but " + container.size().toString());

    // TEST ASSIGN
    test_assign<ContainerT, IteratorT, ReverseT>(container);
}