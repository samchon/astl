import { Vector } from "./Vector";
import { ReverseIteratorBase } from "../internal/iterator/ReverseIteratorBase";

import { CMath } from "../internal/numeric/CMath";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";
import { Pair } from "../utility/Pair";

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
        this.matrix_.back().reserve(Deque.MIN_ROW_CAPACITY);

        this.size_ = 0;
        this.capacity_ = Deque.ROW_SIZE * Deque.MIN_ROW_CAPACITY;
    }

    @inline
    public assign<InputIterator>
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

    public clear(): void
    {
        this.matrix_ = new Vector();
        this.matrix_.push_back(new Vector());
        this.matrix_.back().reserve(Deque.MIN_ROW_CAPACITY);

        this.size_ = 0;
        this.capacity_ = 8;
    }

    @inline
    public resize(n: usize): void
    {
        this._Reserve(n, n);
        this.size_ = n;
    }

    @inline
    public reserve(capacity: usize): void
    {
        if (this.capacity_ < CMath.max(capacity, Deque.ROW_SIZE * Deque.MIN_ROW_CAPACITY))
            this._Reserve(capacity, this.size());
    }

    private _Reserve(capacity: usize, limit: usize): void
    {
        // FIX CAPACITY
        capacity = CMath.max(capacity, Deque.ROW_SIZE * Deque.MIN_ROW_CAPACITY);
        const length: usize = this._Compute_row_size(capacity);
        capacity = length * Deque.ROW_SIZE;
        
        // CREATE THE NEW MATRIX
        const matrix: Vector<Vector<T>> = new Vector();
        matrix.reserve(Deque.ROW_SIZE);
        this._Insert_row(matrix.end(), length);

        // RE-FILL THE VALES
        if (limit !== 0)
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
    @inline
    public size(): usize
    {
        return this.size_;
    }

    @inline
    public empty(): boolean
    {
        return this.size() === 0;
    }

    @inline
    public capacity(): usize
    {
        return this.capacity_;
    }

    private _Compute_row_size(capacity: usize): usize
    {
        const value: f64 = capacity / <f64>Deque.ROW_SIZE;
        const ret: usize = <usize>Math.ceil(value);

        return ret;
    }

    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    @inline
    @operator("[]")
    public at(index: usize): T
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("Deque.at()", index, this.size());

        const tuple: Pair<usize, usize> = this._Fetch_index(index);
        return this.matrix_.at(tuple.first).at(tuple.second);
    }

    @inline
    @operator("[]=")
    public set(index: usize, val: T): void
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("Deque.set()", index, this.size());

        const tuple: Pair<usize, usize> = this._Fetch_index(index);
        this.matrix_.at(tuple.first).set(tuple.second, val);
    }
    
    @inline
    public front(): T
    {
        return this.at(0);
    }

    @inline
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
    @inline
    public nth(index: usize): Deque.Iterator<T>
    {
        return new Deque.Iterator(this, index);
    }

    @inline
    public begin(): Deque.Iterator<T>
    {
        return this.nth(0);
    }

    @inline
    public end(): Deque.Iterator<T>
    {
        return this.nth(this.size());
    }

    @inline
    public rbegin(): Deque.ReverseIterator<T>
    {
        return this.end().reverse();
    }

    @inline
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
        let top: Vector<T> = this.matrix_.front();

        // ADD A NEW ROW IF REQUIRED
        if (top.size() >= length && this.matrix_.size() < Deque.ROW_SIZE)
            top = this._Insert_row(this.matrix_.begin(), length);

        // INSERT ITEM
        top.insert(top.begin(), val);
        ++this.size_;
    }

    public push_back(val: T): void
    {
        // EXPAND CAPACITY
        this._Try_expand(1);

        const length: usize = this._Compute_row_size(this.capacity());
        let bottom: Vector<T> = this.matrix_.back();

        // ADD A NEW ROW IF REQUIRED
        if (bottom.size() >= length && this.matrix_.size() < Deque.ROW_SIZE)
            bottom = this._Insert_row(this.matrix_.end(), length);

        // INSERT ITEM
        bottom.push_back(val);
        ++this.size_;
    }
    
    @inline
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

    public insert_range<InputIterator>
        (pos: Deque.Iterator<T>, first: InputIterator, last: InputIterator): Deque.Iterator<T>
    {
        const plus: usize = distance(first, last);
        if (plus === 0)
            return pos;

        if (pos == this.end())
        {
            this._Try_expand(plus);
            this._Fill_range(this.matrix_, this._Compute_row_size(this.capacity()), first, last);
            this.size_ += plus;
        }
        else if (this.capacity() >= this.size() + plus)
        {
            const tuple: Pair<usize, usize> = this._Fetch_index(pos.index());
            const row: Vector<T> = this.matrix_.at(tuple.first);

            row.insert_range(row.nth(tuple.second), first, last);
            this.size_ += plus;
        }
        else
        {
            const deque: Deque<T> = new Deque();
            deque._Reserve(CMath.max(this.size() + plus, this.capacity() * 2), 0);

            deque.insert_range(deque.end(), this.begin(), pos);
            deque.insert_range(deque.end(), first, last);
            deque.insert_range(deque.end(), pos, this.end());
            
            this.swap(deque);
        }
        return pos;
    }

    private _Insert_row(pos: Vector.Iterator<Vector<T>>, length: usize): Vector<T>
    {
        const row: Vector<T> = new Vector<T>();
        row.reserve(length);
        pos.source().insert(pos, row);

        return row;
    }

    private _Fill_range<InputIterator>
        (matrix: Vector<Vector<T>>, length: usize, first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
        {
            let row: Vector<T> = matrix.back();
            if (row.size() >= length)
                row = this._Insert_row(matrix.end(), length);
            
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
        const top: Vector<T> = this.matrix_.front();
        top.erase(top.begin());

        if (top.empty() === true && this.matrix_.size() > 1)
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
        const bottom: Vector<T> = this.matrix_.back();
        bottom.pop_back();

        if (bottom.empty() === true && this.matrix_.size() > 1)
            this.matrix_.pop_back();

        // SHRINK THE SIZE
        --this.size_;
    }

    public erase(first: Deque.Iterator<T>, last: Deque.Iterator<T> = first.next()): Deque.Iterator<T>
    {
        if (first.index() >= last.index())
            return first;

        let remained: usize = CMath.min(this.size(), last.index()) - first.index();
        this.size_ -= remained;

        let tuple: Pair<usize, usize> | null = null;
        let top: Vector<T> | null = null;
        let bottom: Vector<T> | null = null;
        
        while (remained !== 0)
        {
            // LIST UP THE TARGET ROW
            tuple = this._Fetch_index(first.index());
            const row: Vector<T> = this.matrix_.at(tuple.first);
            const col: usize = tuple.second;

            // ERASE FROM THE ROW
            const length: usize = CMath.min(remained, row.size() - col);
            row.erase(row.nth(col), row.nth(col + length));
            remained -= length;

            // TO MERGE
            if (row.size() !== 0)
                if (top !== null)
                    top = row;
                else
                    bottom = row;

            // ERASE THE ENTIRE ROW IF REQUIRED
            if (row.empty() === true && this.matrix_.size() > 1)
                this.matrix_.erase(this.matrix_.nth(tuple.first));
        }

        // MERGE FIRST AND SECOND ROW IF POSSIBLE
        if (top !== null && bottom !== null && top.size() + bottom.size() <= this._Compute_row_size(this.capacity()))
        {
            top.insert_range(top.end(), bottom.begin(), bottom.end());
            this.matrix_.erase(this.matrix_.nth(tuple!.first + 1));
        }
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

        // CAPACITY
        const capacity: usize = this.capacity_;
        this.capacity_ = obj.capacity_;
        obj.capacity_= capacity;
    }
}

export namespace Deque
{
    export const ROW_SIZE: usize = 8;
    export const MIN_ROW_CAPACITY: usize = 4;
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
        public source(): Deque<T>
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
            return this.source_ === obj.source_
                && this.index_ === obj.index_;
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
        extends ReverseIteratorBase<T, Deque<T>, Deque<T>, Iterator<T>, ReverseIterator<T>, T>
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