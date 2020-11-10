import { MapElementVector } from "../../internal/container/associative/MapElementVector";
import { Comparator } from "../../internal/functional/Comparator";
import { less } from "../../functional/comparators";

import { ErrorGenerator } from "../../internal/exception/ErrorGenerator";
import { Entry } from "../../utility/Entry";

import { IForwardIterator } from "../../iterator/IForwardIterator";
import { IPair } from "../../utility/IPair";
import { Pair } from "../../utility/Pair";

export class FlatMap<Key, T>
{
    public data_: MapElementVector<Key, T, true, FlatMap<Key, T>> = new MapElementVector(<FlatMap<Key, T>>this);

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.data_.assign(comp);
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
    }

    public swap(obj: FlatMap<Key, T>): void
    {
        this.data_.swap(obj.data_);

        const data: MapElementVector<Key, T, true, FlatMap<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public size(): usize
    {
        return this.data_.size();
    }

    @inline()
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline()
    public nth(index: usize): FlatMap.Iterator<Key, T>
    {
        return this.data_.nth(index);
    }

    @inline()
    public begin(): FlatMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): FlatMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): FlatMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): FlatMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): FlatMap.Iterator<Key, T>
    {
        const it: FlatMap.Iterator<Key, T> = this.lower_bound(key);
        if (it != this.end() && this.key_comp()(key, it.first) === false)
            return it;
        else
            return this.end();
    }

    @inline()
    public has(key: Key): boolean
    {
        return this.find(key) != this.end();
    }

    @inline()
    public count(key: Key): usize
    {
        return this.has(key) ? 1 : 0;
    }

    @inline()
    @operator("[]")
    public get(key: Key): T
    {
        const it = this.find(key);
        if (it == this.end())
            throw ErrorGenerator.key_nout_found("TreeMap.get()", key);
        return it.second;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.data_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): FlatMap.Iterator<Key, T>
    {
        return this.data_.lower_bound(key);
    }

    @inline()
    public upper_bound(key: Key): FlatMap.Iterator<Key, T>
    {
        return this.data_.upper_bound(key);
    }

    @inline()
    public equal_range(key: Key): Pair<FlatMap.Iterator<Key, T>, FlatMap.Iterator<Key, T>>
    {
        return this.data_.equal_range(key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline()
    @operator("[]=")
    public set(key: Key, value: T): void
    {
        const tuple: Pair<FlatMap.Iterator<Key, T>, boolean> = this.emplace(key, value);
        if (tuple.second === false)
            tuple.first.second = value;
    }

    public emplace(key: Key, value: T): Pair<FlatMap.Iterator<Key, T>, boolean>
    {
        const lower: FlatMap.Iterator<Key, T> = this.lower_bound(key);
        if (lower != this.end() && this.key_comp()(key, lower.first) === false)
            return new Pair(lower, false);

        const entry: Entry<Key, T> = new Entry(key, value);
        const it: FlatMap.Iterator<Key, T> = this.data_.insert(lower, entry);

        return new Pair(it, true);
    }

    public emplace_hint(hint: FlatMap.Iterator<Key, T>, key: Key, value: T): FlatMap.Iterator<Key, T>
    {
        return this.emplace(key, value).first;
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.emplace(first.value.first, first.value.second);
    }

    public erase(first: FlatMap.Iterator<Key, T>, last: FlatMap.Iterator<Key, T> = first.next()): FlatMap.Iterator<Key, T>
    {
        return this.data_.erase(first, last);
    }

    public erase_by_key(key: Key): usize
    {
        const it: FlatMap.Iterator<Key, T> = this.find(key);
        if (it == this.end())
            return 0;

        this.data_.erase(it);
        return 1;
    }
}

export namespace FlatMap
{
    export type Iterator<Key, T> = MapElementVector.Iterator<Key, T, true, FlatMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementVector.ReverseIterator<Key, T, true, FlatMap<Key, T>>;
}