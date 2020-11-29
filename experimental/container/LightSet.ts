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

export class LightSet<Key>
{
    private buckets_: HashBuckets<Key, Element<Key>>;
    private data_: Vector<Element<Key>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor
        (
            hasher: Hasher<Key> = key => hash(key), 
            predicator: BinaryPredicator<Key> = (x, y) => equal_to(x, y)
        )
    {
        this.buckets_ = new HashBuckets(hasher, predicator, elem => elem.key);
        this.data_ = new Vector();
    }

    @inline
    public clear(): void
    {
        this.buckets_.clear();
        this.data_.clear();
    }

    public swap(obj: LightSet<Key>): void
    {
        const buckets: HashBuckets<Key, Element<Key>> = this.buckets_;
        this.buckets_ = obj.buckets_;
        obj.buckets_ = buckets;

        const data: Vector<Element<Key>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* =========================================================
        ACCESSORS
            - CAPACITIES
            - BUCKETS
            - ELEMENTS
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
    public begin(): LightSet.Iterator<Key>
    {
        return LightSet._Nth(this, 0);
    }

    @inline
    public end(): LightSet.Iterator<Key>
    {
        return new LightSet.Iterator(this, this.data_.size());
    }

    @inline
    public rbegin(): LightSet.ReverseIterator<Key>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): LightSet.ReverseIterator<Key>
    {
        return this.begin().reverse();
    }

    public static _Nth<Key>(source: LightSet<Key>, index: usize): LightSet.Iterator<Key>
    {
        for (; index < source.data_.size(); ++index)
            if (source.data_.at(index).erased === false)
                return new LightSet.Iterator(source, index);
        return source.end();
    }

    public static _Prev<Key>(source: LightSet<Key>, index: usize): LightSet.Iterator<Key>
    {
        index = CMath.min(index, source.size());
        while (index !== 0)
        {
            const elem: Element<Key> = source.data_.at(--index);
            if (elem.erased === false)
                return new LightSet.Iterator(source, index);
        }
        return source.end();
    }

    @inline
    public static _At<Key>(source: LightSet<Key>, index: usize): Key
    {
        return source.data_.at(index).key;
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
    @operator("[]=")
    public insert(key: Key): void
    {
        let elem: Element<Key> | null = this.buckets_.find(key);
        if (elem !== null)
            return;

        elem = new Element(key);
        this.buckets_.insert(elem);
        this.data_.push_back(elem);
    }

    public erase(first: LightSet.Iterator<Key>, last: LightSet.Iterator<Key> = first.next()): LightSet.Iterator<Key>
    {
        for (let i: usize = first.index(); i < last.index(); ++i)
        {
            const elem: Element<Key> = this.data_.at(i);
            if (elem.erased === true)
                continue;
            
            this.buckets_.erase(elem);
            elem.delete();
        }
        return LightSet._Nth(this, last.index());
    }

    public erase_by_key(key: Key): usize
    {
        const elem: Element<Key> | null = this.buckets_.find(key);
        if (elem === null)
            return 0;

        this.buckets_.erase(elem);
        elem.delete();
        return 1;
    }
}

export namespace LightSet
{
    export class Iterator<Key>
    {
        private readonly source_: LightSet<Key>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: LightSet<Key>, index: usize)
        {
            this.source_ = source;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator<Key>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key>
        {
            return LightSet._Prev(this.source_, this.index_);
        }
        
        @inline
        public next(): Iterator<Key>
        {
            return LightSet._Nth(this.source_, this.index_ + 1);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): LightSet<Key>
        {
            return this.source_;
        }

        @inline
        public index(): usize
        {
            return this.index_;
        }

        @inline
        public get value(): Key
        {
            return LightSet._At(this.source_, this.index_);
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("==")
        public equals(obj: Iterator<Key>): boolean
        {
            return this.source_ === obj.source_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator<Key>): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<Key>): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator<Key>): boolean
        {
            return this.source_ === obj.source_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator<Key>): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator<Key>): boolean
        {
            return this.source_ === obj.source_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator<Key>
        extends ReverseIteratorBase<Key,
            LightSet<Key>,
            Iterator<Key>,
            ReverseIterator<Key>,
            Key>
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
        public get value(): Key
        {
            return this.base_.value;
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("<")
        public less(obj: ReverseIterator<Key>): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator<Key>): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator<Key>): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator<Key>): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}

class Element<Key>
{
    private key_: Key;
    private erased_: boolean;

    public constructor(key: Key)
    {
        this.key_ = key;
        this.erased_ = false;
    }

    @inline
    public delete(): void
    {
        this.key_ = changetype<Key>(0);
        this.erased_ = true;
    }

    @inline public get key(): Key { return this.key_ ; }
    @inline public get erased(): boolean { return this.erased_; }
}