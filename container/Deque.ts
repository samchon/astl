import { Vector } from "./Vector";
import { ReverseIterator as ReverseBase } from "../internal/iterator/ReverseIterator";

import { CMath } from "../internal/numeric/CMath";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";
import { Pair } from "../utility/Pair";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Repeater } from "../internal/iterator/disposable/Repeater";
import { distance } from "../iterator/global";

export class Deque<T>
{
    private matrix_: Vector<Vector<T>>;
    private size_: usize;
    private capacity_: usize;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.matrix_ = new Vector();
        this.matrix_.push_back(new Vector());
        this.size_ = 0;
        this.capacity_ = 8;
    }

    public clear(): void
    {
        this.matrix_.clear();
        this.matrix_.push_back(new Vector());
        this.capacity_ = 8;
    }

    @inline()
    public resize(n: usize): void
    {
        this._Reserve(n, n);
    }

    private _Reserve(capacity: usize, limit: usize): void
    {
        // FIX CAPACITY
        const length: usize = this._Compute_row_size(capacity);
        capacity = length * Deque.ROW_SIZE;
        
        // CREATE THE NEW MATRIX
        const matrix: Vector<Vector<T>> = new Vector();
        matrix.reserve(Deque.ROW_SIZE);

        // RE-FILL THE VALES
        if (limit === 0)
        {
            const v: Vector<T> = new Vector();
            v.reserve(length);
            matrix.push_back(v);
        }
        else
            this._Fill_range(matrix, length, this.begin(), this.nth(limit));

        // ASSIGN THE MEMBERS
        this.matrix_ = matrix;
        this.capacity_ = capacity;
    }

    private _Try_expand(plus: usize, limit: usize = this.size()): void
    {
        const required: usize = this.size() + plus;
        if (this.capacity())
            return;

        const capacity: usize = CMath.max(required, this.capacity() * 2);
        this._Reserve(capacity, limit);
    }

    /* =========================================================
        ACCESSORS
            - CAPACITIES
            - ELEMENTS
            - ITERATORS
    ============================================================
        CAPACITIES
    --------------------------------------------------------- */
    @inline()
    public size(): usize
    {
        return this.size_;
    }

    @inline()
    public empty(): boolean
    {
        return this.size() === 0;
    }

    @inline()
    public capacity(): usize
    {
        return this.capacity_;
    }

    private _Compute_row_size(capacity: usize): usize
    {
        const value: f64 = capacity / <f64>Deque.ROW_SIZE;
        const ret: usize = <usize>Math.ceil(value);

        return CMath.max(ret, Deque.MIN_ROW_CAPACITY);
    }

    private _Clone(): Deque<T>
    {
        const ret: Deque<T> = new Deque();
        ret.size_ = this.size_;
        ret.capacity_ = this.capacity_;
        ret.matrix_ = this.matrix_;

        return ret;
    }

    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    @inline()
    @operator("[]")
    public at(index: usize): T
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("Deque.at()", index, this.size());

        const tuple: Pair<usize, usize> = this._Fetch_index(index);
        return this.matrix_.at(tuple.first).at(tuple.second);
    }

    @inline()
    @operator("[]=")
    public set(index: usize, val: T): void
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("Deque.set()", index, this.size());

        const tuple: Pair<usize, usize> = this._Fetch_index(index);
        this.matrix_.at(tuple.first).set(tuple.second, val);
    }
    
    @inline()
    public front(): T
    {
        return this.at(0);
    }

    @inline()
    public back(): T
    {
        return this.at(this.size() - 1);
    }

    private _Fetch_index(index: usize): Pair<usize, usize>
    {
        // Fetch row and column's index.
        let row: usize;
        for (row = 0; row < this.matrix_.size(); row++)
        {
            const vector: Vector<T> = this.matrix_.at(row);
            if (index < vector.size())
                break;
            index -= vector.size();
        }

        if (row === this.matrix_.size())
            row--;

        return new Pair(row, index);
    }

    /* ---------------------------------------------------------
        ITERATORS
    --------------------------------------------------------- */
    @inline()
    public nth(index: usize): Deque.Iterator<T>
    {
        return new Deque.Iterator(this, index);
    }

    @inline()
    public begin(): Deque.Iterator<T>
    {
        return this.nth(0);
    }

    @inline()
    public end(): Deque.Iterator<T>
    {
        return this.nth(this.size());
    }

    @inline()
    public rbegin(): Deque.ReverseIterator<T>
    {
        return this.end().reverse();
    }

    @inline()
    public rend(): Deque.ReverseIterator<T>
    {
        return this.begin().reverse();
    }

    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - SWAP
    ============================================================
        INSERT
    --------------------------------------------------------- */
    public push_front(val: T): void
    {
        // EXPAND CAPACITY
        this._Try_expand(1);

        const length: usize = this._Compute_row_size(this.capacity());
        let first: Vector<T> = this.matrix_.front();

        // ADD A NEW ROW IF REQUIRED
        if (first.size() >= length && this.matrix_.size() < Deque.ROW_SIZE)
        {
            first = new Vector();
            first.reserve(length);

            this.matrix_.insert(this.matrix_.begin(), first);
        }

        // INSERT ITEM
        first.insert(first.begin(), val);
        ++this.size_;
    }

    public push_back(val: T): void
    {
        // EXPAND CAPACITY
        this._Try_expand(1);

        const length: usize = this._Compute_row_size(this.capacity());
        let last: Vector<T> = this.matrix_.back();

        // ADD A NEW ROW IF REQUIRED
        if (last.size() >= length && this.matrix_.size() < Deque.ROW_SIZE)
        {
            last = new Vector();
            last.reserve(length);

            this.matrix_.push_back(last);
        }

        // INSERT ITEM
        this.matrix_.back().push_back(val);
        ++this.size_;
    }
    
    @inline()
    public insert(pos: Deque.Iterator<T>, val: T): Deque.Iterator<T>
    {
        return this.insert_repeatedly(pos, 1, val);
    }

    public insert_repeatedly(pos: Deque.Iterator<T>, n: usize, val: T): Deque.Iterator<T>
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n, val);

        return this.insert_range(pos, first, last);
    }

    public insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: Deque.Iterator<T>, first: InputIterator, last: InputIterator): Deque.Iterator<T>
    {
        const cloned: Deque<T> = this._Clone();
        const plus: usize = distance(first, last);
        this._Try_expand(plus, pos.index());

        const length: usize = this._Compute_row_size(this.capacity());
        this._Fill_range(this.matrix_, length, first, last);
        this._Fill_range(this.matrix_, length, cloned.nth(pos.index()), cloned.end());

        this.size_ += plus;
        return pos;
    }

    private _Fill_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (matrix: Vector<Vector<T>>, length: usize, first: InputIterator, last: InputIterator): void
    {
        let row!: Vector<T>;
        let index: usize = 0;

        for (; first != last; first = first.next())
        {
            if (index++ % length === 0)
            {
                row = new Vector();
                row.reserve(length);
                matrix.push_back(row);
            }
            row.push_back(first.value);
        }
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    public pop_front(): void
    {
        // VALIDATE
        if (this.empty() === true)
            throw ErrorGenerator.empty("Deque.pop_front()");

        // ERASE THE FIRST ELEMENT
        const first: Vector<T> = this.matrix_.front();
        first.erase(first.begin());

        if (first.empty() === true && this.matrix_.size() > 1)
            this.matrix_.erase(this.matrix_.begin());

        // SHRINK THE SIZE
        --this.size_;
    }

    public pop_back(): void
    {
        // VALIDATE
        if (this.empty() === true)
            throw ErrorGenerator.empty("Deque.pop_back()");

        // ERASE THE LAST ELEMENT
        const last: Vector<T> = this.matrix_.back();
        last.pop_back();

        if (last.empty() === true && this.matrix_.size() > 1)
            this.matrix_.pop_back();

        // SHRINK THE SIZE
        --this.size_;
    }

    public erase(first: Deque.Iterator<T>, last: Deque.Iterator<T> = first.next()): Deque.Iterator<T>
    {
        const cloned: Deque<T> = this._Clone();
        const distance: usize = last.index() - first.index();

        this.clear();
        this._Reserve(this.size() - distance, 0);

        const length: usize = this._Compute_row_size(this.capacity());
        this._Fill_range(this.matrix_, length, cloned.begin(), cloned.nth(first.index()));
        this._Fill_range(this.matrix_, length, cloned.nth(last.index()), cloned.end());

        this.size_ -= distance;
        return first;
    }

    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    public swap(obj: Deque<T>): void
    {
        // MATRIX
        const matrix: Vector<Vector<T>> = this.matrix_;
        this.matrix_ = obj.matrix_;
        obj.matrix_ = matrix;

        // SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }
}

export namespace Deque
{
    export const ROW_SIZE: usize = 8;
    export const MIN_ROW_CAPACITY: usize = 32;
    export const MAGNIFIER: usize = 2;

    export class Iterator<T>
    {
        private readonly source_: Deque<T>;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: Deque<T>, index: usize)
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
        public source(): Deque<T>
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
        public equals(obj: Deque.Iterator<T>): boolean
        {
            return this.source_ === obj.source_
                && this.index_ === obj.index_;
        }
        
        @inline()
        @operator("!=")
        public __not_equals(obj: Deque.Iterator<T>): boolean
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
        extends ReverseBase<T, Deque<T>, Deque<T>, Iterator<T>, ReverseIterator<T>, T>
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