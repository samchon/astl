import { IForwardIterator } from "../iterator/IForwardIterator";
import { VectorContainer } from "../internal/container/linear/VectorContainer";
import { ArrayIterator } from "../internal/iterator/ArrayIterator";
import { ArrayReverseIterator } from "../internal/iterator/ArrayReverseIterator";

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
        extends ArrayIterator<T, Vector<T>, Vector<T>, Iterator<T>, ReverseIterator<T>, T>
    {
        @inline()
        public source(): Vector<T>
        {
            return this.container_;
        }

        @inline()
        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        @inline()
        public get value(): T
        {
            return this.container_.at(this.index_);
        }
        public set value(val: T)
        {
            this.container_.set(this.index_, val);
        }
    }

    export class ReverseIterator<T>
        extends ArrayReverseIterator<T, Vector<T>, Vector<T>, Iterator<T>, ReverseIterator<T>, T>
    {
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