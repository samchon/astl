import std from "../../../../index";

function test_assign<ContainerT, IteratorT>(container: ContainerT): void
{
    const replica: ContainerT = instantiate<ContainerT>();
    replica.assign<IteratorT>(container.begin(), container.end());
}

export function test_unique_tree_container_base<ContainerT, IteratorT>
    (
        emplacer: (source: ContainerT, key: i32, value: i32) => std.Pair<IteratorT, boolean>,
        keyGetter: (it: IteratorT) => i32,
        valueGetter: (it: IteratorT) => i32
    ): void
{
    //----
    // INSERTIONS
    //----
    // LIST UP ELEMENTS
    const elements: Array<i32> = [];
    for (let i: i32 = 0; i < 1000; i += 10)
        elements.push(i);

    // RANDOM SHUFFLE
    const container: ContainerT = instantiate<ContainerT>();
    while (elements.length !== 0)
    {
        const index: i32 = std.randint<i32>(0, elements.length - 1);
        const key: i32 = elements[index];

        for (let j: i32 = 0; j < 4; ++j)
        {
            const tuple: std.Pair<IteratorT, boolean> = emplacer(container, key, key + j);
            if (!j !== tuple.second)
                throw new Error("Bug on " + nameof<ContainerT>() + ".insert(" + key.toString() + "): must be " + (!j).toString() + " but " + tuple.second.toString());
            else if (valueGetter(tuple.first) !== key)
                throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): must be failed to update the second value, but succeeded.");
        }
        elements.splice(index, 1);
    }

    // VALIDATE SIZE
    if (container.size() !== 100)
        throw new Error("Bug on " + nameof<ContainerT>() + ".size(): must be 100 but " + container.size().toString());

    //----
    // ITERATIONS
    //----
    for (let i: i32 = 0; i < 1000; ++i)
    {
        // FIND BY KEY
        const it: IteratorT = container.find(i);
        const exists: boolean = it != container.end();

        const must: boolean = (i % 10) === 0;
        if (must !== exists)
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(): " + nameof<ContainerT>() + ".find(" + i.toString() + ") !== " + nameof<ContainerT>() + ".end(): must be " + must.toString() + " but " + exists.toString());

        // BOUNDERS
        const tuple: std.Pair<IteratorT, IteratorT> = container.equal_range(i);
        if (must === true && keyGetter(tuple.first) !== i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".lower_bound(" + i.toString() + "): must be " + i.toString() + " but " + keyGetter(tuple.first).toString());
        else if (must === false && tuple.first != container.end() && keyGetter(tuple.first) <= i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".lower_bound(" + i.toString() + "): must be greater than " + i.toString());
        else if (tuple.second != container.end() && keyGetter(tuple.second) <= i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".upper_bound(" + i.toString() + "): must be greater than " + i.toString());
    }

    // IS SORTED
    let prev: i32 = -1;
    for (let it: IteratorT = container.begin(); it != container.end(); it = it.next())
    {
        if (keyGetter(it) <= prev)
            throw new Error("Bug on " + nameof<ContainerT>() + ": elements are not sorted.");
        else if (keyGetter(it) !== valueGetter(it))
            throw new Error("Bug on " + nameof<ContainerT>() + ": key and value must be same in this test program.");
        
        prev = keyGetter(it);
    }

    test_assign<ContainerT, IteratorT>(container);
}