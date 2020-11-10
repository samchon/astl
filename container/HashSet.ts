import { SetElementList } from "../internal/container/associative/SetElementList";
import { IteratorHashBuckets } from "../internal/hash/IteratorHashBuckets";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Pair } from "../utility/Pair";

import { Hasher } from "../internal/functional/Hasher";
import { BinaryPredicator } from "../internal/functional/BinaryPredicator";
import { hash } from "../functional/hash";
import { equal_to } from "../functional/comparators";

export class HashSet<Key>
{
    private data_: SetElementList<Key, true, HashSet<Key>> = new SetElementList(<HashSet<Key>>this);
    private buckets_: IteratorHashBuckets<Key, HashSet.Iterator<Key>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key> = elem => hash(elem), predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y))
    {
        this.buckets_ = new IteratorHashBuckets(hasher, predicator, it => it.value);
    }
    
    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.buckets_.clear();
    }

    public swap(obj: HashSet<Key>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: SetElementList<Key, true, HashSet<Key>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP BUCKETS
        const buckets: IteratorHashBuckets<Key, HashSet.Iterator<Key>> = this.buckets_;
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
    public begin(): HashSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): HashSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): HashSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): HashSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): HashSet.Iterator<Key>
    {
        const it: HashSet.Iterator<Key> | null = this.buckets_.find(key);
        return (it !== null) ? it : this.end();
    }

    @inline()
    public has(key: Key): boolean
    {
        return this.buckets_.find(key) !== null;
    }

    @inline()
    public count(key: Key): usize
    {
        return this.has(key) ? 1 : 0;
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
    public insert(key: Key): Pair<HashSet.Iterator<Key>, boolean>
    {
        let it: HashSet.Iterator<Key> = this.find(key);
        if (it != this.end())
            return new Pair(it, false);

        it = this.data_.insert(it, key);
        this.buckets_.insert(it);

        return new Pair(it, true);
    }

    public insert_hint(hint: HashSet.Iterator<Key>, key: Key): HashSet.Iterator<Key>
    {
        let it: HashSet.Iterator<Key> = this.find(key);
        if (it == this.end())
        {
            it = this.data_.insert(hint, key);
            this.buckets_.insert(it);
        }
        return it;
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }

    public erase(first: HashSet.Iterator<Key>, last: HashSet.Iterator<Key> = first.next()): HashSet.Iterator<Key>
    {
        const it: HashSet.Iterator<Key> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.buckets_.erase(first);

        return it;
    }

    public erase_by_key(key: Key): usize
    {
        const it: HashSet.Iterator<Key> | null = this.buckets_.find(key);
        if (it === null)
            return 0;

        this.erase(it);
        return 1;
    }
}

export namespace HashSet
{
    export type Iterator<Key> = SetElementList.Iterator<Key, true, HashSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, true, HashSet<Key>>;
}