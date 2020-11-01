import { VectorContainer } from "../internal/container/linear/VectorContainer";
import { ReverseIterator as ReverseBase } from "../internal/iterator/ReverseIterator";

import { IForwardIterator } from "../iterator/IForwardIterator";

export class Vector<T> 
    extends VectorContainer<T>
{
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public nth(index: usize): Vector.Iterator<T>
    {
        return new Vector.Iterator(this, index);
    }

    @inline()
    public begin(): Vector.Iterator<T>
    {
        return this.nth(0);
    }

    @inline()
    public end(): Vector.Iterator<T>
    {
        return this.nth(this.size());
    }

    @inline()
    public rbegin(): Vector.ReverseIterator<T>
    {
        return this.end().reverse();
    }

    @inline()
    public rend(): Vector.ReverseIterator<T>
    {
        return this.begin().reverse();
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline()
    public insert(pos: Vector.Iterator<T>, val: T): Vector.Iterator<T>
    {
        this._Insert(pos.index(), val);
        return pos;
    }
    
    @inline()
    public insert_repeatedly(pos: Vector.Iterator<T>, n: usize, val: T): Vector.Iterator<T>
    {
        this._Insert_repeatedly(pos.index(), n, val);
        return pos;
    }

    @inline()
    public insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: Vector.Iterator<T>, first: InputIterator, last: InputIterator): Vector.Iterator<T>
    {
        this._Insert_range(pos.index(), first, last);
        return pos;
    }

    @inline()
    public erase(first: Vector.Iterator<T>, last: Vector.Iterator<T> = first.next()): Vector.Iterator<T>
    {
        this._Erase(first.index(), last.index());
        return first;
    }

    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    @inline()
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

        @inline()
        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        @inline()
        public prev(): Iterator<T>
        {
            return this.advance(-1);
        }

        @inline()
        public next(): Iterator<T>
        {
            return this.advance(1);
        }

        @inline()
        public advance(n: isize): Iterator<T>
        {
            return this.source_.nth(this.index_ + n);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline()
        public source(): Vector<T>
        {
            return this.source_;
        }

        @inline()
        public index(): usize
        {
            return this.index_;
        }

        @inline()
        @operator("==")
        public equals(obj: Vector.Iterator<T>): boolean
        {
            return this.source_ === obj.source_
                && this.index_ === obj.index_;
        }
        
        @inline()
        @operator("!=")
        public __not_equals(obj: Vector.Iterator<T>): boolean
        {
            return !this.equals(obj);
        }

        @inline()
        public get value(): T
        {
            return this.source_.at(this.index_);
        }
        public set value(val: T)
        {
            this.source_.set(this.index_, val);
        }
    }

    export class ReverseIterator<T>
        extends ReverseBase<T, Vector<T>, Vector<T>, Iterator<T>, ReverseIterator<T>, T>
    {   
        @inline()
        public advance(n: isize): ReverseIterator<T>
        {
            return this.base().advance(-n).reverse();
        }

        @inline()
        public index(): usize
        {
            return this.base().index();
        }

        @inline()
        public get value(): T
        {
            return this.base_.value;
        }
        public set value(val: T)
        {
            this.base_.value = val;
        }
    }
}