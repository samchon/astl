import { SetElementList } from "../internal/container/associative/SetElementList";
import { IteratorHashBuckets } from "../internal/hash/IteratorHashBuckets";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Vector } from "./Vector";

import { BinaryPredicator } from "../internal/functional/BinaryPredicator";
import { Hasher } from "../internal/functional/Hasher";
import { hash } from "../functional/hash";
import { equal_to } from "../functional/comparators";

export class HashMultiSet<Key>
{
    private data_: SetElementList<Key, false, HashMultiSet<Key>> = new SetElementList(<HashMultiSet<Key>>this);
    private buckets_: IteratorHashBuckets<Key, HashMultiSet.Iterator<Key>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key> = elem => hash(elem), predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y))
    {
        this.buckets_ = new IteratorHashBuckets(hasher, predicator, it => it.value);
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
        this.buckets_.clear();
    }

    public swap(obj: HashMultiSet<Key>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: SetElementList<Key, true, HashMultiSet<Key>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP BUCKETS
        const buckets: IteratorHashBuckets<Key, HashMultiSet.Iterator<Key>> = this.buckets_;
        this.buckets_ = obj.buckets_;
        obj.buckets_ = buckets;
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
    public begin(): HashMultiSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): HashMultiSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): HashMultiSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): HashMultiSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): HashMultiSet.Iterator<Key>
    {
        const it: HashMultiSet.Iterator<Key> | null = this.buckets_.find(key);
        return (it !== null) ? it : this.end();
    }

    @inline()
    public has(key: Key): boolean
    {
        return this.buckets_.find(key) !== null;
    }

    public count(key: Key): usize
    {
        const index: usize = this.bucket(key);
        const bucket: Vector<HashMultiSet.Iterator<Key>> = this.buckets_.at(index);

        let ret: usize = 0;
        for (let i: usize = 0; i < bucket.size(); ++i)
            if (this.key_eq()(key, bucket.at(i).value) === true)
                ++ret;

        return ret;
    }

    @inline()
    public hash_function(): Hasher<Key>
    {
        return this.buckets_.hash_function();
    }

    @inline()
    public key_eq(): BinaryPredicator<Key>
    {
        return this.buckets_.key_eq();
    }

    @inline()
    public bucket(key: Key): usize
    {
        return this.hash_function()(key) % this.bucket_count();
    }

    @inline()
    public bucket_count(): usize
    {
        return this.buckets_.length();
    }

    @inline()
    public bucket_size(index: usize): usize
    {
        return this.buckets_.at(index).size();
    }

    @inline()
    public load_factor(): usize
    {
        return this.buckets_.load_factor();
    }

    @inline()
    public max_load_factor(): f64
    {
        return this.buckets_.max_load_factor();
    }

    @inline()
    public set_max_load_factor(z: f64): void
    {
        this.buckets_.set_max_load_factor(z);
    }

    @inline()
    public reserve(n: usize): void
    {
        this.buckets_.reserve(n);
    }

    @inline()
    public rehash(n: usize): void
    {
        this.buckets_.rehash(n);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline()
    public insert(key: Key): HashMultiSet.Iterator<Key>
    {
        return this.insert_hint(this.end(), key);
    }
    
    @inline()
    public insert_hint(hint: HashMultiSet.Iterator<Key>, key: Key): HashMultiSet.Iterator<Key>
    {
        const it: HashMultiSet.Iterator<Key> = this.data_.insert(hint, key);
        this.buckets_.insert(it);
        return it;
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
        {
            const it: HashMultiSet.Iterator<Key> = this.data_.insert(this.data_.end(), first.value);
            this.buckets_.insert(it);
        }
    }

    public erase(first: HashMultiSet.Iterator<Key>, last: HashMultiSet.Iterator<Key> = first.next()): HashMultiSet.Iterator<Key>
    {
        const it: HashMultiSet.Iterator<Key> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.buckets_.erase(first);

        return it;
    }

    public erase_by_key(key: Key): usize
    {
        const index: usize = this.bucket(key);
        const bucket: Vector<HashMultiSet.Iterator<Key>> = this.buckets_.at(index);

        let count: usize = 0;
        for (let it = bucket.rbegin(); it != bucket.rend(); it = it.next())
            if (this.key_eq()(key, it.value.value))
            {
                this.erase(it.value);
                ++count;
            }
        return count;
    }
}

export namespace HashMultiSet
{
    export type Iterator<Key> = SetElementList.Iterator<Key, false, HashMultiSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, false, HashMultiSet<Key>>;
}