import { MapElementList } from "../internal/container/associative/MapElementList";
import { IteratorHashBuckets } from "../internal/hash/IteratorHashBuckets";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { IPair } from "../utility/IPair";
import { Entry } from "../utility/Entry";

import { Hasher } from "../internal/functional/Hasher";
import { BinaryPredicator } from "../internal/functional/BinaryPredicator";
import { Vector } from "./Vector";

export class HashMultiMap<Key, T>
{
    private data_: MapElementList<Key, T, false, HashMultiMap<Key, T>> = new MapElementList(<HashMultiMap<Key, T>>this);
    private buckets_: IteratorHashBuckets<Key, HashMultiMap.Iterator<Key, T>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key>, predicator: BinaryPredicator<Key>)
    {
        this.buckets_ = new IteratorHashBuckets(hasher, predicator, it => it.first);
    }

    public clear(): void
    {
        this.data_.clear();
        this.buckets_.clear();
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    public size(): usize
    {
        return this.data_.size();
    }

    public empty(): boolean
    {
        return this.data_.empty();
    }

    public begin(): HashMultiMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    public end(): HashMultiMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    public rbegin(): HashMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    public rend(): HashMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    public find(key: Key): HashMultiMap.Iterator<Key, T>
    {
        const it: HashMultiMap.Iterator<Key, T> | null = this.buckets_.find(key);
        return (it !== null) ? it : this.end();
    }

    public has(key: Key): boolean
    {
        return this.buckets_.find(key) !== null;
    }

    public count(key: Key): usize
    {
        const index: usize = this.bucket(key);
        const bucket: Vector<HashMultiMap.Iterator<Key, T>> = this.buckets_.at(index);

        let ret: usize = 0;
        for (let i: usize = 0; i < bucket.size(); ++i)
            if (this.key_eq()(key, bucket.at(i).first) === true)
                ++ret;

        return ret;
    }

    public hash_function(): Hasher<Key>
    {
        return this.buckets_.hash_function();
    }

    public key_eq(): BinaryPredicator<Key>
    {
        return this.buckets_.key_eq();
    }

    public bucket(key: Key): usize
    {
        return this.hash_function()(key) % this.bucket_count();
    }

    public bucket_count(): usize
    {
        return this.buckets_.length();
    }

    public bucket_size(index: usize): usize
    {
        return this.buckets_.at(index).size();
    }

    public load_factor(): usize
    {
        return this.buckets_.load_factor();
    }

    public max_load_factor(): f64
    {
        return this.buckets_.max_load_factor();
    }

    public set_max_load_factor(z: f64): void
    {
        this.buckets_.set_max_load_factor(z);
    }

    public reserve(n: usize): void
    {
        this.buckets_.reserve(n);
    }

    public rehash(n: usize): void
    {
        this.buckets_.rehash(n);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public emplace(key: Key, value: T): HashMultiMap.Iterator<Key, T>
    {
        return this.emplace_hint(this.end(), key, value);
    }

    public emplace_hint(hint: HashMultiMap.Iterator<Key, T>, key: Key, value: T): HashMultiMap.Iterator<Key, T>
    {
        const entry: Entry<Key, T> = new Entry(key, value);
        const it: HashMultiMap.Iterator<Key, T> = this.data_.insert(hint, entry);

        this.buckets_.insert(it);
        return it;
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
        {
            const entry: Entry<Key, T> = new Entry(first.value.first, first.value.second);
            const it: HashMultiMap.Iterator<Key, T> = this.data_.insert(this.data_.end(), entry);

            this.buckets_.insert(it);
        }
    }

    public erase(first: HashMultiMap.Iterator<Key, T>, last: HashMultiMap.Iterator<Key, T> = first.next()): HashMultiMap.Iterator<Key, T>
    {
        const it: HashMultiMap.Iterator<Key, T> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.buckets_.erase(first);

        return it;
    }

    public erase_by_key(key: Key): usize
    {
        const index: usize = this.bucket(key);
        const bucket: Vector<HashMultiMap.Iterator<Key, T>> = this.buckets_.at(index);

        let count: usize = 0;
        for (let it = bucket.rbegin(); it != bucket.rend(); it = it.next())
            if (this.key_eq()(key, it.value.first))
            {
                this.erase(it.value);
                ++count;
            }
        return count;
    }
}

export namespace HashMultiMap
{
    export type Iterator<Key, T> = MapElementList.Iterator<Key, T, false, HashMultiMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementList.ReverseIterator<Key, T, false, HashMultiMap<Key, T>>;
}