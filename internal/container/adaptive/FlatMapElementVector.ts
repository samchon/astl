import { ITreeMap } from "../associative/ITreeMap";
import { VectorContainer } from "../linear/VectorContainer";

import { Comparator } from "../../functional/Comparator";
import { ReverseIteratorBase } from "../../iterator/ReverseIteratorBase";

import { IPair } from "../../../utility/IPair";
import { Entry } from "../../../utility/Entry";
import { Pair } from "../../../utility";

export class FlatMapElementVector<Key, T,
        Unique extends boolean,
        SourceT extends ITreeMap<Key, T, Unique, SourceT,
            FlatMapElementVector.Iterator<Key, T, Unique, SourceT>,
            FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>>>
    extends VectorContainer<Entry<Key, T>>
{
    private source_: SourceT;
    private comp_: Comparator<Key>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(source: SourceT)
    {
        super();
        
        this.source_ = source;
        this.comp_ = changetype<Comparator<Key>>(0);
    }

    @inline
    public assign(comp: Comparator<Key>): void
    {
        this.comp_ = comp;
    }

    public swap(obj: FlatMapElementVector<Key, T, Unique, SourceT>): void
    {
        const source: SourceT = this.source_;
        this.source_ = obj.source_;
        obj.source_ = source;
    }

    /* ---------------------------------------------------------
        ACCCESSORS
    --------------------------------------------------------- */
    @inline
    public source(): SourceT
    {
        return this.source_;
    }

    @inline
    public key_comp(): Comparator<Key>
    {
        return this.comp_;
    }

    @inline
    public nth(index: usize): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        return new FlatMapElementVector.Iterator(this, index);
    }

    @inline
    public begin(): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        return this.nth(0);
    }

    @inline
    public end(): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        return this.nth(this.size());
    }

    @inline
    public rbegin(): FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>
    {
        return this.begin().reverse();
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline
    public insert(pos: FlatMapElementVector.Iterator<Key, T, Unique, SourceT>, val: Entry<Key, T>): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        this._Insert(pos.index(), val);
        return pos;
    }

    @inline
    public erase(first: FlatMapElementVector.Iterator<Key, T, Unique, SourceT>, last: FlatMapElementVector.Iterator<Key, T, Unique, SourceT> = first.next()): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        this._Erase(first.index(), last.index());
        return first;
    }

    /* ---------------------------------------------------------
        BOUNDERS
    --------------------------------------------------------- */
    public lower_bound(key: Key): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        let index: usize = 0;
        let count: isize = this.size();

        while (count > 0)
        {
            const step: isize = count / 2;
            const entry: Entry<Key, T> = this.at(index + step);

            if (this.comp_(entry.first, key) === true)
            {
                index += step + 1;
                count -= step + 1;
            }
            else
                count = step;
        }
        return this.nth(index);
    }

    @inline
    public upper_bound(key: Key): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        return this._Upper_bound(key, 0);
    }
    
    @inline
    public equal_range(key: Key): Pair<FlatMapElementVector.Iterator<Key, T, Unique, SourceT>, FlatMapElementVector.Iterator<Key, T, Unique, SourceT>>
    {
        const lower: FlatMapElementVector.Iterator<Key, T, Unique, SourceT> = this.lower_bound(key);
        const upper: FlatMapElementVector.Iterator<Key, T, Unique, SourceT> = this._Upper_bound(key, lower.index());

        return new Pair(lower, upper);
    }
    
    private _Upper_bound(key: Key, index: usize): FlatMapElementVector.Iterator<Key, T, Unique, SourceT>
    {
        let count: isize = this.size() - index;
        while (count > 0)
        {
            const step: isize = count / 2;
            const entry: Entry<Key, T> = this.at(index + step);

            if (this.comp_(key, entry.first) === false)
            {
                index += step + 1;
                count -= step + 1;
            }
            else
                count = step;
        }
        return this.nth(index);
    }
}

export namespace FlatMapElementVector
{
    export class Iterator<Key, T,
            Unique extends boolean,
            SourceT extends ITreeMap<Key, T, Unique, SourceT,
                FlatMapElementVector.Iterator<Key, T, Unique, SourceT>,
                FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>>>
    {
        private readonly data_: FlatMapElementVector<Key, T, Unique, SourceT>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(data: FlatMapElementVector<Key, T, Unique, SourceT>, index: usize)
        {
            this.data_ = data;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator<Key, T, Unique, SourceT>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key, T, Unique, SourceT>
        {
            return this.advance(-1);
        }

        @inline
        public next(): Iterator<Key, T, Unique, SourceT>
        {
            return this.advance(1);
        }

        @inline
        public advance(n: isize): Iterator<Key, T, Unique, SourceT>
        {
            return this.data_.nth(this.index_ + n);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): SourceT
        {
            return this.data_.source();
        }

        @inline
        public index(): usize
        {
            return this.index_;
        }

        @inline
        public get value(): Entry<Key, T>
        {
            return this.data_.at(this.index_);
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
        public equals(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator<Key, T,
            Unique extends boolean,
            SourceT extends ITreeMap<Key, T, Unique, SourceT,
                FlatMapElementVector.Iterator<Key, T, Unique, SourceT>,
                FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>>>
        extends ReverseIteratorBase<Entry<Key, T>, 
            SourceT, 
            FlatMapElementVector.Iterator<Key, T, Unique, SourceT>,
            FlatMapElementVector.ReverseIterator<Key, T, Unique, SourceT>,
            IPair<Key, T>>
    {
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public advance(n: isize): ReverseIterator<Key, T, Unique, SourceT>
        {
            return this.base().advance(-n).reverse();
        }

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
        public less(obj: ReverseIterator<Key, T, Unique, SourceT>): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator<Key, T, Unique, SourceT>): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator<Key, T, Unique, SourceT>): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator<Key, T, Unique, SourceT>): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}