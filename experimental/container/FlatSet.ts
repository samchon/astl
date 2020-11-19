import { SetElementVector } from "../../internal/container/associative/SetElementVector";
import { Comparator } from "../../internal/functional/Comparator";
import { less } from "../../functional/comparators";

import { IForwardIterator } from "../../iterator/IForwardIterator";
import { ErrorGenerator } from "../../internal/exception/ErrorGenerator";
import { Pair } from "../../utility/Pair";

export class FlatSet<Key>
{
    public data_: SetElementVector<Key, true, FlatSet<Key>> = new SetElementVector(<FlatSet<Key>>this);

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.data_.assign(comp);
    }

    @inline
    public assign<InputIterator extends IForwardIterator<Key, InputIterator>>
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

    public swap(obj: FlatSet<Key>): void
    {
        this.data_.swap(obj.data_);

        const data: SetElementVector<Key, true, FlatSet<Key>> = this.data_;
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
    public nth(index: usize): FlatSet.Iterator<Key>
    {
        return this.data_.nth(index);
    }

    @inline
    public begin(): FlatSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline
    public end(): FlatSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline
    public rbegin(): FlatSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline
    public rend(): FlatSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline
    public find(key: Key): FlatSet.Iterator<Key>
    {
        const it: FlatSet.Iterator<Key> = this.lower_bound(key);
        if (it != this.end() && this.key_comp()(key, it.value) === false)
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
        return this.has(key) ? 1 : 0;
    }

    @inline
    public key_comp(): Comparator<Key>
    {
        return this.data_.key_comp();
    }

    @inline
    public lower_bound(key: Key): FlatSet.Iterator<Key>
    {
        return this.data_.lower_bound(key);
    }

    @inline
    public upper_bound(key: Key): FlatSet.Iterator<Key>
    {
        return this.data_.upper_bound(key);
    }

    @inline
    public equal_range(key: Key): Pair<FlatSet.Iterator<Key>, FlatSet.Iterator<Key>>
    {
        return this.data_.equal_range(key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): Pair<FlatSet.Iterator<Key>, boolean>
    {
        const lower: FlatSet.Iterator<Key> = this.lower_bound(key);
        if (lower != this.end() && this.key_comp()(key, lower.value) === false)
            return new Pair(lower, false);

        const it: FlatSet.Iterator<Key> = this.data_.insert(lower, key);
        return new Pair(it, true);
    }

    @inline
    public insert_hint(hint: FlatSet.Iterator<Key>, key: Key): FlatSet.Iterator<Key>
    {
        return this.insert(key).first;
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }

    @inline
    public erase(first: FlatSet.Iterator<Key>, last: FlatSet.Iterator<Key> = first.next()): FlatSet.Iterator<Key>
    {
        return this.data_.erase(first, last);
    }

    public erase_by_key(key: Key): usize
    {
        const it: FlatSet.Iterator<Key> = this.find(key);
        if (it == this.end())
            return 0;

        this.data_.erase(it);
        return 1;
    }
}

export namespace FlatSet
{
    export type Iterator<Key> = SetElementVector.Iterator<Key, true, FlatSet<Key>>;
    export type ReverseIterator<Key> = SetElementVector.ReverseIterator<Key, true, FlatSet<Key>>;
}