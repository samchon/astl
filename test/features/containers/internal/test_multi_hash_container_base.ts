export function test_multi_hash_container_base<ContainerT, IteratorT>
    (
        emplacer: (container: ContainerT, key: i32, value: i32) => IteratorT,
        keyGetter: (it: IteratorT) => i32,
        valueGetter: (it: IteratorT) => i32
    ): void
{
    // INSERTIONS
    const container: ContainerT = instantiate<ContainerT>();
    for (let k: i32 = 0; k < 4; ++k)
        for (let i: i32 = 0; i < 1000; ++i)
            emplacer(container, i, i + k);

    if (container.size() !== 4000)
        throw new Error("Bug on " + nameof<ContainerT>() + ".size(): must be 4000 but " + container.size().toString());

    // FIND INSERTED ELEMENTS
    for (let i: i32 = 0; i < 1000; ++i)
    {
        const it: IteratorT = container.find(i);
        const count: usize = container.count(i);

        if (it == container.end())
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): key exists, but failed to find it.");
        else if (keyGetter(it) !== i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): it.first must be not " + keyGetter(it).toString() + " but " + i.toString());
        else if (valueGetter(it) !== i)
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): it.second must be not " + valueGetter(it).toString() + " but " + i.toString());
        else if (count !== 4)
            throw new Error("Bug on " + nameof<ContainerT>() + ".count(" + i.toString() + "): must be not " + count.toString() + " but 4");
    }

    // FIND UN-INSERTED ELEMENTS
    for (let i: i32 = 1000; i < 2000; ++i)
    {
        const it: IteratorT = container.find(i);
        if (it != container.end())
            throw new Error("Bug on " + nameof<ContainerT>() + ".find(" + i.toString() + "): key does not exist, but succeeded to find something - " + keyGetter(it).toString());
    }

    // WHETHER INSERTION ORDER BE KEPT OR NOT
    let it: IteratorT = container.begin();
    for (let k: i32 = 0; k < 4; ++k)
    {
        let previous: i32 = keyGetter(it);
        for (let i: i32 = 0; i < 999; ++i)
        {
            it = it.next();
            if (keyGetter(it) <= previous)
                throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): insertion order has not been kept.");
            else if (valueGetter(it) !== keyGetter(it) && valueGetter(it) !== i + 1 + k)
                throw new Error("Bug on " + nameof<ContainerT>() + ".emplace(): second must be not " + valueGetter(it).toString() + " but " + (i + 1 + k).toString());
        }
        it = it.next();
    }
}