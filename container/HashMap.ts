import { MapElementList } from "../internal/container/associative/MapElementList";
import { IteratorHashBuckets } from "../internal/hash/IteratorHashBuckets";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { IPair } from "../utility/IPair";
import { Pair } from "../utility/Pair";
import { Entry } from "../utility/Entry";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";

import { BinaryPredicator } from "../internal/functional/BinaryPredicator";
import { Hasher } from "../internal/functional/Hasher";
import { hash } from "../functional/hash";
import { equal_to } from "../functional/comparators";

export class HashMap<Key, T>
{
    private data_: MapElementList<Key, T, true, HashMap<Key, T>> = new MapElementList(<HashMap<Key, T>>this);
    private buckets_: IteratorHashBuckets<Key, HashMap.Iterator<Key, T>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key> = elem => hash(elem), predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y))
    {
        this.buckets_ = new IteratorHashBuckets(hasher, predicator, it => it.first);
    }
    
    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.buckets_.clear();
    }
    
    public swap(obj: HashMap<Key, T>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: MapElementList<Key, T, true, HashMap<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP BUCKETS
        const buckets: IteratorHashBuckets<Key, HashMap.Iterator<Key, T>> = this.buckets_;
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
    public begin(): HashMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): HashMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): HashMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): HashMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): HashMap.Iterator<Key, T>
    {
        const it: HashMap.Iterator<Key, T> | null = this.buckets_.find(key);
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
    @operator("[]")
    public get(key: Key): T
    {
        const it: HashMap.Iterator<Key, T> | null = this.buckets_.find(key);
        if (it === null)
            throw ErrorGenerator.key_nout_found("HashMap.get()", key);
        return it.second;
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
    @operator("[]=")
    public set(key: Key, value: T): void
    {
        const tuple: Pair<HashMap.Iterator<Key, T>, boolean> = this.emplace(key, value);
        if (tuple.second === false)
            tuple.first.second = value;
    }

    public emplace(key: Key, value: T): Pair<HashMap.Iterator<Key, T>, boolean>
    {
        let it: HashMap.Iterator<Key, T> = this.find(key);
        if (it != this.end())
            return new Pair(it, false);

        it = this.data_.insert(it, new Entry(key, value));
        this.buckets_.insert(it);

        return new Pair(it, true);
    }

    public emplace_hint(hint: HashMap.Iterator<Key, T>, key: Key, value: T): HashMap.Iterator<Key, T>
    {
        let it: HashMap.Iterator<Key, T> | null = this.buckets_.find(key);
        if (it === null)
        {
            it = this.data_.insert(hint, new Entry(key, value));
            this.buckets_.insert(it);
        }
        return it;
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.emplace(first.value.first, first.value.second);
    }

    public erase(first: HashMap.Iterator<Key, T>, last: HashMap.Iterator<Key, T> = first.next()): HashMap.Iterator<Key, T>
    {
        const it: HashMap.Iterator<Key, T> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.buckets_.erase(first);

        return it;
    }

    public erase_by_key(key: Key): usize
    {
        const it: HashMap.Iterator<Key, T> | null = this.buckets_.find(key);
        if (it === null)
            return 0;

        this.erase(it);
        return 1;
    }
}

export namespace HashMap
{
    export type Iterator<Key, T> = MapElementList.Iterator<Key, T, true, HashMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementList.ReverseIterator<Key, T, true, HashMap<Key, T>>;
}