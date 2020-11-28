import { HashBuckets } from "../../internal/hash/HashBuckets";

import { BinaryPredicator } from "../../internal/functional/BinaryPredicator";
import { Hasher } from "../../internal/functional/Hasher";
import { equal_to } from "../../functional/comparators";
import { hash } from "../../functional/hash";

import { HashSetElementVector } from "../../internal/container/adaptive/HashSetElementVector";
import { Pair } from "../../utility/Pair";
import { IForwardIterator } from "../../iterator/IForwardIterator";

export class FlatHashSet<Key>
{
    private buckets_: HashBuckets<Key, Key>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key> = elem => hash(elem), predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y))
    {
        this.buckets_ = new HashBuckets(hasher, predicator, key => key);
    }

    public clear(): void
    {
        this.buckets_.clear();
    }

    public swap(obj: FlatHashSet<Key>): void
    {
        // SWAP BUCKETS
        const buckets: HashBuckets<Key, Key> = this.buckets_;
        this.buckets_ = obj.buckets_;
        obj.buckets_ = buckets;
    }
    
    @inline
    private nth(indexes: Pair<usize, usize>): FlatHashSet.Iterator<Key>
    {
        return instantiate<FlatHashSet.Iterator<Key>>(this, indexes);
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public size(): usize
    {
        return this.buckets_.size();
    }

    @inline
    public empty(): boolean
    {
        return this.size() === 0;
    }

    @inline
    public begin(): FlatHashSet.Iterator<Key>
    {
        const ret: FlatHashSet.Iterator<Key> = this.nth(new Pair(0, 0));
        if (this.empty() === false && this.buckets_.at(0).empty() === true)
            return ret.next();
        else
            return ret;
    }
    
    @inline
    public end(): FlatHashSet.Iterator<Key>
    {
        return this.nth(new Pair(this.buckets_.count(), 0));
    }

    @inline
    public rbegin(): FlatHashSet.ReverseIterator<Key>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): FlatHashSet.ReverseIterator<Key>
    {
        return this.begin().reverse();
    }

    @inline
    public find(key: Key): FlatHashSet.Iterator<Key>
    {
        const indexes: Pair<usize, usize> | null = this.buckets_.indexes(key);
        return (indexes !== null) 
            ? this.nth(indexes)
            : this.end();
    }

    @inline
    public has(key: Key): boolean
    {
        return this.buckets_.indexes(key) !== null;
    }

    @inline
    public count(key: Key): usize
    {
        return this.has(key) ? 1 : 0;
    }

    @inline
    public hash_function(): Hasher<Key>
    {
        return this.buckets_.hash_function();
    }

    @inline
    public key_eq(): BinaryPredicator<Key>
    {
        return this.buckets_.key_eq();
    }

    @inline
    public bucket(key: Key): usize
    {
        return this.hash_function()(key) % this.bucket_count();
    }

    @inline
    public bucket_count(): usize
    {
        return this.buckets_.count();
    }

    @inline
    public bucket_size(index: usize): usize
    {
        return this.buckets_.at(index).size();
    }

    @inline
    public load_factor(): usize
    {
        return this.buckets_.load_factor();
    }

    @inline
    public max_load_factor(): f64
    {
        return this.buckets_.max_load_factor();
    }

    @inline
    public set_max_load_factor(z: f64): void
    {
        this.buckets_.set_max_load_factor(z);
    }

    @inline
    public reserve(n: usize): void
    {
        this.buckets_.reserve(n);
    }

    @inline
    public rehash(n: usize): void
    {
        this.buckets_.rehash(n);
    }

    @inline
    public get_buckets(): HashBuckets<Key, Key>
    {
        return this.buckets_;
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): Pair<FlatHashSet.Iterator<Key>, boolean>
    {
        let indexes: Pair<usize, usize> | null = this.buckets_.indexes(key);
        if (indexes !== null)
            return new Pair(this.nth(indexes), false);

        indexes = this.buckets_.insert(key);
        return new Pair(this.nth(indexes), true);
    }

    @inline
    public insert_hint(hint: FlatHashSet.Iterator<Key>, key: Key): FlatHashSet.Iterator<Key>
    {
        return this.insert(key).first;
    }

    @inline
    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }

    @inline
    public erase(first: FlatHashSet.Iterator<Key>, last: FlatHashSet.Iterator<Key> = first.next()): FlatHashSet.Iterator<Key>
    {
        this.buckets_.erase_range(first.indexes(), last.indexes());
        return first;
    }

    @inline
    public erase_by_key(key: Key): usize
    {
        return this.buckets_.erase(key) ? 1 : 0;
    }
}

export namespace FlatHashSet
{
    export type Iterator<Key> = HashSetElementVector.Iterator<Key, true, FlatHashSet<Key>>;
    export type ReverseIterator<Key> = HashSetElementVector.ReverseIterator<Key, true, FlatHashSet<Key>>;
}