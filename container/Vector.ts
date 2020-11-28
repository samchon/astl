import { VectorContainer } from "../internal/container/linear/VectorContainer";
import { ReverseIteratorBase } from "../internal/iterator/ReverseIteratorBase";

import { IForwardIterator } from "../iterator/IForwardIterator";

export class Vector<T> 
    extends VectorContainer<T>
{
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    @inline
    public assign<InputIterator extends IForwardIterator<T, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(this.end(), first, last);
    }

    @inline
    public assign_repeatedly(length: usize, value: T): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_repeatedly(this.end(), length, value);
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public nth(index: usize): Vector.Iterator<T>
    {
        return new Vector.Iterator(this, index);
    }

    @inline
    public begin(): Vector.Iterator<T>
    {
        return this.nth(0);
    }

    @inline
    public end(): Vector.Iterator<T>
    {
        return this.nth(this.size());
    }

    @inline
    public rbegin(): Vector.ReverseIterator<T>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): Vector.ReverseIterator<T>
    {
        return this.begin().reverse();
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline
    public insert(pos: Vector.Iterator<T>, val: T): Vector.Iterator<T>
    {
        this._Insert(pos.index(), val);
        return pos;
    }
    
    @inline
    public insert_repeatedly(pos: Vector.Iterator<T>, n: usize, val: T): Vector.Iterator<T>
    {
        this._Insert_repeatedly(pos.index(), n, val);
        return pos;
    }

    @inline
    public insert_range<InputIterator>
        (pos: Vector.Iterator<T>, first: InputIterator, last: InputIterator): Vector.Iterator<T>
    {
        this._Insert_range(pos.index(), first, last);
        return pos;
    }

    @inline
    public erase(first: Vector.Iterator<T>, last: Vector.Iterator<T> = first.next()): Vector.Iterator<T>
    {
        this._Erase(first.index(), last.index());
        return first;
    }

    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    @inline
    public swap(obj: Vector<T>): void
    {
        this._Swap(obj);
    }
}

export namespace Vector
{
    export class Iterator<T>
    {
        private readonly source_: Vector<T>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: Vector<T>, index: usize)
        {
            this.source_ = source;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<T>
        {
            return this.advance(-1);
        }

        @inline
        public next(): Iterator<T>
        {
            return this.advance(1);
        }

        @inline
        public advance(n: isize): Iterator<T>
        {
            return this.source_.nth(this.index_ + n);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): Vector<T>
        {
            return this.source_;
        }

        @inline
        public index(): usize
        {
            return this.index_;
        }

        @inline
        public get value(): T
        {
            return this.source_.at(this.index_);
        }

        @inline
        public set value(val: T)
        {
            this.source_.set(this.index_, val);
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("==")
        public equals(obj: Iterator<T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator<T>): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<T>): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator<T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator<T>): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator<T>): boolean
        {
            return this.source_ === obj.source_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator<T>
        extends ReverseIteratorBase<T, Vector<T>, Iterator<T>, ReverseIterator<T>, T>
    {
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */   
        @inline
        public advance(n: isize): ReverseIterator<T>
        {
            return this.base().advance(-n).reverse();
        }

        @inline
        public index(): usize
        {
            return this.base().index();
        }

        @inline
        public get value(): T
        {
            return this.base_.value;
        }

        @inline
        public set value(val: T)
        {
            this.base_.value = val;
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("<")
        public less(obj: ReverseIterator<T>): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator<T>): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator<T>): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator<T>): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}