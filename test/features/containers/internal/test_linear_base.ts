import std from "../../../../index";
import { ILinearContainer, ILinearContainerIterator, ILinearContainerReverseIterator } from "../../../../internal/container/linear/ILinearContainer";

export function test_linear_base<
        ContainerT extends ILinearContainer<i32, ContainerT, ContainerT, IteratorT, ReverseT, i32>,
        IteratorT extends ILinearContainerIterator<i32, ContainerT, ContainerT, IteratorT, ReverseT, i32>,
        ReverseT extends ILinearContainerReverseIterator<i32, ContainerT, ContainerT, IteratorT, ReverseT, i32>>
    (): void
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
}