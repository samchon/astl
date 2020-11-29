import { ITreeSet } from "../associative/ITreeSet";
import { VectorContainer } from "../linear/VectorContainer";

import { ReverseIteratorBase } from "../../iterator/ReverseIteratorBase";

import { Comparator } from "../../functional/Comparator";
import { Pair } from "../../../utility";

export class FlatSetElementVector<Key,
        Unique extends boolean,
        SourceT extends ITreeSet<Key, Unique, SourceT,
            FlatSetElementVector.Iterator<Key, Unique, SourceT>,
            FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>>>
    extends VectorContainer<Key>
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

    public swap(obj: FlatSetElementVector<Key, Unique, SourceT>): void
    {
        const source: SourceT = this.source_;
        this.source_ = obj.source_;
        obj.source_ = source;

        const comp: Comparator<Key> = this.comp_;
        this.comp_ = obj.comp_;
        obj.comp_ = comp;
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
    public nth(index: usize): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        return new FlatSetElementVector.Iterator(this, index);
    }

    @inline
    public begin(): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        return this.nth(0);
    }

    @inline
    public end(): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        return this.nth(this.size());
    }

    @inline
    public rbegin(): FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>
    {
        return this.begin().reverse();
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline
    public insert(pos: FlatSetElementVector.Iterator<Key, Unique, SourceT>, val: Key): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        this._Insert(pos.index(), val);
        return pos;
    }

    @inline
    public erase(first: FlatSetElementVector.Iterator<Key, Unique, SourceT>, last: FlatSetElementVector.Iterator<Key, Unique, SourceT> = first.next()): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        this._Erase(first.index(), last.index());
        return first;
    }

    /* ---------------------------------------------------------
        BOUNDERS
    --------------------------------------------------------- */
    public lower_bound(key: Key): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        let index: usize = 0;
        let count: isize = this.size();

        while (count > 0)
        {
            const step: isize = count / 2;
            const target: Key = this.at(index + step);

            if (this.comp_(target, key) === true)
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
    public upper_bound(key: Key): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        return this._Upper_bound(key, 0);
    }
    
    @inline
    public equal_range(key: Key): Pair<FlatSetElementVector.Iterator<Key, Unique, SourceT>, FlatSetElementVector.Iterator<Key, Unique, SourceT>>
    {
        const lower: FlatSetElementVector.Iterator<Key, Unique, SourceT> = this.lower_bound(key);
        const upper: FlatSetElementVector.Iterator<Key, Unique, SourceT> = this._Upper_bound(key, lower.index());

        return new Pair(lower, upper);
    }
    
    private _Upper_bound(key: Key, index: usize): FlatSetElementVector.Iterator<Key, Unique, SourceT>
    {
        let count: isize = this.size() - index;
        while (count > 0)
        {
            const step: isize = count / 2;
            const target: Key = this.at(index + step);

            if (this.comp_(key, target) === false)
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

export namespace FlatSetElementVector
{
    export class Iterator<Key,
            Unique extends boolean,
            SourceT extends ITreeSet<Key, Unique, SourceT,
                FlatSetElementVector.Iterator<Key, Unique, SourceT>,
                FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>>>
    {
        private readonly data_: FlatSetElementVector<Key, Unique, SourceT>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(data: FlatSetElementVector<Key, Unique, SourceT>, index: usize)
        {
            this.data_ = data;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator<Key, Unique, SourceT>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key, Unique, SourceT>
        {
            return this.advance(-1);
        }

        @inline
        public next(): Iterator<Key, Unique, SourceT>
        {
            return this.advance(1);
        }

        @inline
        public advance(n: isize): Iterator<Key, Unique, SourceT>
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
        public get value(): Key
        {
            return this.data_.at(this.index_);
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("==")
        public equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.data_ === obj.data_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator<Key,
            Unique extends boolean,
            SourceT extends ITreeSet<Key, Unique, SourceT,
                FlatSetElementVector.Iterator<Key, Unique, SourceT>,
                FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>>>
        extends ReverseIteratorBase<Key, 
            SourceT, 
            FlatSetElementVector.Iterator<Key, Unique, SourceT>,
            FlatSetElementVector.ReverseIterator<Key, Unique, SourceT>,
            Key>
    {
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public advance(n: isize): ReverseIterator<Key, Unique, SourceT>
        {
            return this.base().advance(-n).reverse();
        }

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
        public less(obj: ReverseIterator<Key, Unique, SourceT>): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator<Key, Unique, SourceT>): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator<Key, Unique, SourceT>): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator<Key, Unique, SourceT>): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}