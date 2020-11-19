import { MapElementVector } from "../../internal/container/associative/MapElementVector";
import { Comparator } from "../../internal/functional/Comparator";
import { less } from "../../functional/comparators";

import { IForwardIterator } from "../../iterator/IForwardIterator";
import { IPair } from "../../utility/IPair";
import { Pair } from "../../utility/Pair";
import { Entry } from "../../utility/Entry";

export class FlatMultiMap<Key, T>
{
    private data_: MapElementVector<Key, T, false, FlatMultiMap<Key, T>> = new MapElementVector(<FlatMultiMap<Key, T>>this);

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.data_.assign(comp);
    }

    @inline
    public assign<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(first, last);
    }

    @inline
    public clear(): void
    {
        this.data_.clear();
    }

    public swap(obj: FlatMultiMap<Key, T>): void
    {
        this.data_.swap(obj.data_);

        const data: MapElementVector<Key, T, true, FlatMultiMap<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public size(): usize
    {
        return this.data_.size();
    }

    @inline
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline
    public nth(index: usize): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.nth(index);
    }

    @inline
    public begin(): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    @inline
    public end(): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    @inline
    public rbegin(): FlatMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    @inline
    public rend(): FlatMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    @inline
    public find(key: Key): FlatMultiMap.Iterator<Key, T>
    {
        const it: FlatMultiMap.Iterator<Key, T> = this.lower_bound(key);
        if (it != this.end() && this.key_comp()(key, it.first) === false)
            return it;
        else
            return this.end();
    }

    @inline
    public has(key: Key): boolean
    {
        return this.find(key) != this.end();
    }

    @inline
    public count(key: Key): usize
    {
        let ret: usize = 0;
        for (let it = this.lower_bound(key); it != this.end() && this.key_comp()(key, it.first) === false; it = it.next())
            ++ret;
        return ret;
    }

    @inline
    public key_comp(): Comparator<Key>
    {
        return this.data_.key_comp();
    }

    @inline
    public lower_bound(key: Key): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.lower_bound(key);
    }

    @inline
    public upper_bound(key: Key): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.upper_bound(key);
    }

    @inline
    public equal_range(key: Key): Pair<FlatMultiMap.Iterator<Key, T>, FlatMultiMap.Iterator<Key, T>>
    {
        return this.data_.equal_range(key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public emplace(key: Key, value: T): FlatMultiMap.Iterator<Key, T>
    {
        const upper: FlatMultiMap.Iterator<Key, T> = this.upper_bound(key);
        return this.data_.insert(upper, new Entry(key, value));
    }

    @inline
    public emplace_hint(hint: FlatMultiMap.Iterator<Key, T>, key: Key, value: T): FlatMultiMap.Iterator<Key, T>
    {
        return this.emplace(key, value);
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.emplace(first.value.first, first.value.second);
    }

    @inline
    public erase(first: FlatMultiMap.Iterator<Key, T>, last: FlatMultiMap.Iterator<Key, T> = first.next()): FlatMultiMap.Iterator<Key, T>
    {
        return this.data_.erase(first, last);
    }

    public erase_by_key(key: Key): usize
    {
        const first: FlatMultiMap.Iterator<Key, T> = this.find(key);
        if (first == this.end())
            return 0;

        let count: usize = 1;
        let last: FlatMultiMap.Iterator<Key, T> = first.next();

        while (last != this.end() && this.key_comp()(key, last.first) === false)
        {
            ++count;
            last = last.next();
        }
        this.data_.erase(first, last);
        return count;
    }
}

export namespace FlatMultiMap
{
    export type Iterator<Key, T> = MapElementVector.Iterator<Key, T, false, FlatMultiMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementVector.ReverseIterator<Key, T, false, FlatMultiMap<Key, T>>;
}