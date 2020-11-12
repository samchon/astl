import std from "../../../../index";

export function test_unique_hash_container_base<ContainerT, IteratorT>
    (
        emplacer: (source: ContainerT, key: i32, value: i32) => std.Pair<IteratorT, boolean>,
        keyGetter: (it: IteratorT) => i32,
        valueGetter: (it: IteratorT) => i32
    ): void
{
    // INSERTIONS
    const container: ContainerT = instantiate<ContainerT>();
    for (let i: i32 = 0; i < 1000; ++i)
        for (let j: i32 = 0; j < 4; ++j)
        {
            const tuple: std.Pair<IteratorT, boolean> = emplacer(container, i, i + j);
            if (!j !== tuple.second)
                throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): must be " + (!j).toString() + " but " + tuple.second.toString());
            else if (valueGetter(tuple.first) !== i)
                throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): must be failed to update the second value, but succeeded.");
        }
    if (container.size() !== 1000)
        throw new Error("Bug on " + nameof<ContainerT>() + ".size(): must be 1000 but " + container.size().toString());

    // FIND INSERTED ELEMENTS
    for (let i: i32 = 0; i < 1000; ++i)
    {
        const it: IteratorT = container.find(i);
        if (it == container.end())
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): key exists, but failed to find it.");
        else if (keyGetter(it) !== i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): it.first must be not " + keyGetter(it).toString() + " but " + i.toString());
        else if (valueGetter(it) !== i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): it.second must be not " + valueGetter(it).toString() + " but " + i.toString());
    }

    // FIND UN-INSERTED ELEMENTS
    for (let i: i32 = 1000; i < 2000; ++i)
    {
        const it: IteratorT = container.find(i);
        if (it != container.end())
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): key does not exist, but succeeded to find something - " + keyGetter(it).toString());
    }

    // WHETHER INSERTION ORDER BE KEPT OR NOT
    let previous: i32 = keyGetter(container.begin());
    for (let it = container.begin().next(); it != container.end(); it = it.next())
    {
        if (keyGetter(it) <= previous)
            throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): insertion order has not been kept.");
        previous = keyGetter(it);
    }
}