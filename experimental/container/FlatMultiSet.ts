import { SetElementVector } from "../../internal/container/associative/SetElementVector";
import { Comparator } from "../../internal/functional/Comparator";
import { less } from "../../functional/comparators";

import { IForwardIterator } from "../../iterator/IForwardIterator";
import { Pair } from "../../utility/Pair";

export class FlatMultiSet<Key>
{
    private data_: SetElementVector<Key, false, FlatMultiSet<Key>> = new SetElementVector(<FlatMultiSet<Key>>this);

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.data_.assign(comp);
    }

    @inline()
    public assign<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(first, last);
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
    }

    public swap(obj: FlatMultiSet<Key>): void
    {
        this.data_.swap(obj.data_);

        const data: SetElementVector<Key, true, FlatMultiSet<Key>> = this.data_;
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
    public nth(index: usize): FlatMultiSet.Iterator<Key>
    {
        return this.data_.nth(index);
    }

    @inline()
    public begin(): FlatMultiSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): FlatMultiSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): FlatMultiSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): FlatMultiSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): FlatMultiSet.Iterator<Key>
    {
        const it: FlatMultiSet.Iterator<Key> = this.lower_bound(key);
        if (it != this.end() && this.key_comp()(key, it.value) === false)
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
        let ret: usize = 0;
        for (let it = this.lower_bound(key); it != this.end() && this.key_comp()(key, it.value) === false; it = it.next())
            ++ret;
        return ret;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.data_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): FlatMultiSet.Iterator<Key>
    {
        return this.data_.lower_bound(key);
    }

    @inline()
    public upper_bound(key: Key): FlatMultiSet.Iterator<Key>
    {
        return this.data_.upper_bound(key);
    }

    @inline()
    public equal_range(key: Key): Pair<FlatMultiSet.Iterator<Key>, FlatMultiSet.Iterator<Key>>
    {
        return this.data_.equal_range(key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): FlatMultiSet.Iterator<Key>
    {
        const upper: FlatMultiSet.Iterator<Key> = this.upper_bound(key);
        return this.data_.insert(upper, key);
    }

    @inline()
    public insert_hint(hint: FlatMultiSet.Iterator<Key>, key: Key): FlatMultiSet.Iterator<Key>
    {
        return this.insert(key);
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }


    @inline()
    public erase(first: FlatMultiSet.Iterator<Key>, last: FlatMultiSet.Iterator<Key> = first.next()): FlatMultiSet.Iterator<Key>
    {
        return this.data_.erase(first, last);
    }

    public erase_by_key(key: Key): usize
    {
        const first: FlatMultiSet.Iterator<Key> = this.find(key);
        if (first == this.end())
            return 0;

        let count: usize = 1;
        let last: FlatMultiSet.Iterator<Key> = first.next();

        while (last != this.end() && this.key_comp()(key, last.value) === false)
        {
            ++count;
            last = last.next();
        }
        this.data_.erase(first, last);
        return count;
    }
}

export namespace FlatMultiSet
{
    export type Iterator<Key> = SetElementVector.Iterator<Key, false, FlatMultiSet<Key>>;
    export type ReverseIterator<Key> = SetElementVector.ReverseIterator<Key, false, FlatMultiSet<Key>>;
}