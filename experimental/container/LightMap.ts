import { HashBuckets } from "../../internal/hash/HashBuckets";
import { Vector } from "../../container/Vector";
import { ReverseIteratorBase } from "../../internal/iterator/ReverseIteratorBase";

import { BinaryPredicator } from "../../internal/functional/BinaryPredicator";
import { Hasher } from "../../internal/functional/Hasher";
import { equal_to } from "../../functional/comparators";
import { hash } from "../../functional/hash";

import { ErrorGenerator } from "../../internal/exception/ErrorGenerator";
import { CMath } from "../../internal/numeric/CMath";
import { Entry } from "../../utility/Entry";
import { IPair } from "../../utility/IPair";

export class LightMap<Key, T>
{
    private buckets_: HashBuckets<Key, Element<Key, T>>;
    private data_: Vector<Element<Key, T>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor
        (
            hasher: Hasher<Key> = key => hash(key), 
            predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y)
        )
    {
        this.buckets_ = new HashBuckets(hasher, predicator, elem => elem.entry.first);
        this.data_ = new Vector();
    }

    @inline
    public clear(): void
    {
        this.buckets_.clear();
        this.data_.clear();
    }

    public swap(obj: LightMap<Key, T>): void
    {
        const buckets: HashBuckets<Key, Element<Key, T>> = this.buckets_;
        this.buckets_ = obj.buckets_;
        obj.buckets_ = buckets;

        const data: Vector<Element<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* =========================================================
        ACCESSORS
            - CAPACITIES
            - BUCKETS
            - FINDERS
    ============================================================
        CAPACITIES
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
    public begin(): LightMap.Iterator<Key, T>
    {
        return LightMap._Nth(this, 0);
    }

    @inline
    public end(): LightMap.Iterator<Key, T>
    {
        return new LightMap.Iterator(this, this.data_.size());
    }

    @inline
    public rbegin(): LightMap.ReverseIterator<Key, T>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): LightMap.ReverseIterator<Key, T>
    {
        return this.begin().reverse();
    }

    public static _Nth<Key, T>(source: LightMap<Key, T>, index: usize): LightMap.Iterator<Key, T>
    {
        for (; index < source.data_.size(); ++index)
            if (source.data_.at(index).erased === false)
                return new LightMap.Iterator(source, index);
        return source.end();
    }

    public static _Prev<Key, T>(source: LightMap<Key, T>, index: usize): LightMap.Iterator<Key, T>
    {
        index = CMath.min(index, source.size());
        while (index !== 0)
        {
            const elem: Element<Key, T> = source.data_.at(--index);
            if (elem.erased === false)
                return new LightMap.Iterator(source, index);
        }
        return source.end();
    }

    @inline
    public static _At<Key, T>(source: LightMap<Key, T>, index: usize): Entry<Key, T>
    {
        return source.data_.at(index).entry;
    }

    /* ---------------------------------------------------------
        BUCKETS
    --------------------------------------------------------- */
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
        return this.buckets_.row_size();
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
        this.data_.reserve(n);
    }

    @inline
    public rehash(n: usize): void
    {
        this.buckets_.rehash(n);
    }

    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    @inline
    public has(key: Key): boolean
    {
        return this.buckets_.find(key) !== null;
    }

    @inline
    public count(key: Key): usize
    {
        return this.has(key) ? 1 : 0;
    }

    @inline
    @operator("[]")
    public get(key: Key): T
    {
        const elem = this.buckets_.find(key);
        if (elem === null)
            throw ErrorGenerator.key_nout_found("LightMap.get()", key);
        
        return elem.entry.second;
    }

    @inline
    @operator("[]=")
    public set(key: Key, value: T): void
    {
        let elem: Element<Key, T> | null = this.buckets_.find(key);
        if (elem === null)
        {
            elem = new Element(new Entry(key, value));
            this.buckets_.insert(elem);
            this.data_.push_back(elem);
        }
        else
            elem.entry.second = value;
    }

    public erase(first: LightMap.Iterator<Key, T>, last: LightMap.Iterator<Key, T> = first.next()): LightMap.Iterator<Key, T>
    {
        for (let i: usize = first.index(); i < last.index(); ++i)
        {
            const elem: Element<Key, T> = this.data_.at(i);
            if (elem.erased === true)
                continue;
            
            this.buckets_.erase(elem);
            elem.delete();
        }
        return LightMap._Nth(this, last.index());
    }

    public erase_by_key(key: Key): usize
    {
        const elem: Element<Key, T> | null = this.buckets_.find(key);
        if (elem === null)
            return 0;

        this.buckets_.erase(elem);
        elem.delete();
        return 1;
    }
}

export namespace LightMap
{
    export class Iterator<Key, T>
    {
        private readonly source_: LightMap<Key, T>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: LightMap<Key, T>, index: usize)
        {
            this.source_ = source;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator<Key, T>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key, T>
        {
            return LightMap._Prev(this.source_, this.index_);
        }
        
        @inline
        public next(): Iterator<Key, T>
        {
            return LightMap._Nth(this.source_, this.index_ + 1);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): LightMap<Key, T>
        {
            return this.source_;
        }

        @inline
        public index(): usize
        {
            return this.index_;
        }

        @inline
        public get value(): Entry<Key, T>
        {
            return LightMap._At(this.source_, this.index_);
        }

        @inline
        public get first(): Key
        {
            return this.value.first;
        }

        @inline
        public get second(): T
        {
            return this.value.second;
        }

        @inline
        public set second(val: T)
        {
            this.value.second = val;
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("==")
        public equals(obj: Iterator<Key, T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator<Key, T>): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<Key, T>): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator<Key, T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator<Key, T>): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator<Key, T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator<Key, T>
        extends ReverseIteratorBase<Entry<Key, T>,
            LightMap<Key, T>,
            Iterator<Key, T>,
            ReverseIterator<Key, T>,
            IPair<Key, T>>
    {
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public index(): usize
        {
            return this.base().index();
        }

        @inline
        public get value(): Entry<Key, T>
        {
            return this.base_.value;
        }

        @inline
        public get first(): Key
        {
            return this.value.first;
        }

        @inline
        public get second(): T
        {
            return this.value.second;
        }

        @inline
        public set second(val: T)
        {
            this.value.second = val;
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("<")
        public less(obj: ReverseIterator<Key, T>): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator<Key, T>): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator<Key, T>): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator<Key, T>): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}

class Element<Key, T>
{
    private entry_: Entry<Key, T>;
    private erased_: boolean;

    public constructor(entry: Entry<Key, T>)
    {
        this.entry_ = entry;
        this.erased_ = false;
    }

    @inline
    public delete(): void
    {
        this.entry_ = changetype<Entry<Key, T>>(0);
        this.erased_ = true;
    }

    @inline public get entry(): Entry<Key, T> { return this.entry_ ; }
    @inline public get erased(): boolean { return this.erased_; }
}