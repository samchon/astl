import { TreeMap } from "./TreeMap";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Pair } from "../utility/Pair";

import { CMath } from "../internal/numeric/CMath";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";
import { ReverseIteratorBase } from "../internal/iterator/ReverseIteratorBase";

export class VectorBoolean
{
    private data_: TreeMap<usize, boolean>;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.data_ = new TreeMap();
        this.size_ = 0;
    }

    @inline
    public assign<InputIterator extends IForwardIterator<boolean, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(this.end(), first, last);
    }

    @inline
    public assign_repeatedly(length: usize, value: boolean): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_repeatedly(this.end(), length, value);
    }

    @inline
    public clear(): void
    {
        this.data_.clear();
        this.size_ = 0;
    }

    @inline
    public flip(): void
    {
        for (let it = this.data_.begin(); it != this.data_.end(); it = it.next())
            it.second = !it.second;
    }

    public swap(obj: VectorBoolean): void
    {
        const data: TreeMap<usize, boolean> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }

    /* ---------------------------------------------------------
        ACCESSORS
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
    public nth(index: usize): VectorBoolean.Iterator
    {
        return new VectorBoolean.Iterator(this, index);
    }

    @inline
    public begin(): VectorBoolean.Iterator
    {
        return this.nth(0);
    }

    @inline
    public end(): VectorBoolean.Iterator
    {
        return this.nth(this.size());
    }

    @inline
    public rbegin(): VectorBoolean.ReverseIterator
    {
        return this.end().reverse();
    }

    @inline
    public rend(): VectorBoolean.ReverseIterator
    {
        return this.begin().reverse();
    }

    @inline
    @operator("[]")
    public at(index: usize): boolean
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("VectorBoolean.at()", index, this.size());
        return this._Find_node(index).second;
    }

    @operator("[]=")
    public set(index: usize, val: boolean): void
    {
        // FIND THE NEAREAST NODE OF LEFT
        let it: TreeMap.Iterator<usize, boolean> = this._Find_node(index);
        if (it.second === val)
            return;

        // CHANGE VALUE
        if (it.first === index)
            it.second = val;
        else
            it = this.data_.emplace(index, val).first;

        //----
        // POST-PROCESS
        //----
        // THE LAST ELEMENT, NO POST-PROCESS REQUIRED
        if (index === this.size() - 1)
            return;

        // LIST UP NEIGHBORS
        const prev: TreeMap.Iterator<usize, boolean> = it.prev();
        const next: TreeMap.Iterator<usize, boolean> = it.next();

        // ARRANGE LEFT SIDE
        if (prev != this.data_.end() && prev.second === it.second)
            this.data_.erase(it);

        // ARRANGE RIGHT SIDE
        if (next == this.data_.end() || next.first !== index + 1 || next.second !== val)
            this.data_.emplace(index + 1, !val);
        else
            this.data_.erase(next);
    }

    @inline
    public front(): boolean
    {
        return this.at(0);
    }

    @inline
    public back(): boolean
    {
        return this.at(this.size() - 1);
    }

    @inline
    private _Find_node(index: usize): TreeMap.Iterator<usize, boolean>
    {
        return this.data_.upper_bound(index).prev();
    }

    /* =========================================================
        ELEMENTS I/O
            - PUSH & POP
            - INSERT
            - ERASE
    ============================================================
        PUSH & POP
    --------------------------------------------------------- */
    public push_back(val: boolean): void
    {
        const index: usize = this.size_++;
        if (this.data_.empty() === false && this.data_.end().prev().second !== val)
            this.data_.emplace(index, val);
    }

    public pop_back(): void
    {
        if (this.empty() === true)
            throw ErrorGenerator.empty("VectorBoolean.pop_back()");

        const it: TreeMap.Iterator<usize, boolean> = this.data_.end().prev();
        const index: usize = --this.size_;

        if (it.first === index)
            this.data_.erase(it);
    }

    /* ---------------------------------------------------------
        INSERT
    --------------------------------------------------------- */
    @inline
    public insert(pos: VectorBoolean.Iterator, val: boolean): VectorBoolean.Iterator
    {
        return this.insert_repeatedly(pos, 1, val);
    }

    public insert_repeatedly(pos: VectorBoolean.Iterator, n: usize, val: boolean): VectorBoolean.Iterator
    {
        const tupleList: Pair<usize, boolean>[] = [];
        tupleList.push(new Pair(n, val));

        if (pos == this.end())
            return this._Insert_to_end(tupleList);
        else
            return this._Insert_to_middle(pos, tupleList);
    }

    public insert_range<InputIterator extends IForwardIterator<boolean, InputIterator>>
        (pos: VectorBoolean.Iterator, first: InputIterator, last: InputIterator): VectorBoolean.Iterator
    {
        const tupleList: Pair<usize, boolean>[] = [];
        for (; first != last; first = first.next())
            if (tupleList.length === 0 || tupleList[tupleList.length - 1].second !== first.value)
                tupleList.push(new Pair(1, first.value));
            else
                ++tupleList[tupleList.length - 1].first;

        if (pos == this.end())
            return this._Insert_to_end(tupleList);
        else
            return this._Insert_to_middle(pos, tupleList);
    }

    private _Insert_to_middle(pos: VectorBoolean.Iterator, tupleList: Pair<usize, boolean>[]): VectorBoolean.Iterator
    {
        const first: TreeMap.Iterator<usize, boolean> = this._Find_node(pos.index());
        for (let it = first; it != this.data_.end(); it = it.next())
        {
            const next: TreeMap.Iterator<usize, boolean> = it.next();
            const sx: usize = it.first < pos.index() ? pos.index() : it.first;
            const sy: usize = next == this.data_.end() ? this.size() : next.first;

            const size: usize = sy - sx;
            const value: boolean = it.second;
            tupleList.push(new Pair(size, value));
        }

        this.size_ = pos.index();
        this.data_.erase(first.first === pos.index() ? first : first.next(), this.data_.end());
        return this._Insert_to_end(tupleList);
    }

    private _Insert_to_end(tupleList: Pair<usize, boolean>[]): VectorBoolean.Iterator
    {
        const oldSize: usize = this.size();
        const lastValue: i8 = this.data_.empty() ? -1 : <i8>this.data_.end().prev().second;

        for (let i: i32 = 0; i < tupleList.length; ++i)
        {
            const tuple: Pair<usize, boolean> = tupleList[i];
            const index: usize = this.size();
            const value: boolean = tuple.second;

            this.size_ += tuple.first;
            if (i === 0 && <i8>value === lastValue)
                continue;

            this.data_.emplace(index, value);
        }
        return this.nth(oldSize);
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    public erase(first: VectorBoolean.Iterator, last: VectorBoolean.Iterator = first.next()): VectorBoolean.Iterator
    {
        const tupleList: Pair<usize, boolean>[] = [];
        if (last != this.end())
        {
            const lastIndex: usize = CMath.min(this.size(), last.index());
            for (let it: TreeMap.Iterator<usize, boolean> = this._Find_node(lastIndex); it != this.data_.end(); it = it.next())
            {
                const next: TreeMap.Iterator<usize, boolean> = it.next();
                const sx: usize = CMath.max(it.first, lastIndex);
                const sy: usize = (next == this.data_.end())
                    ? this.size()
                    : next.first;

                const size: usize = sy - sx;
                const value: boolean = it.second;
                tupleList.push(new Pair(size, value));
            }
        }

        this.size_ = first.index();
        this.data_.erase(this.data_.lower_bound(this.size_), this.data_.end());
        return this._Insert_to_end(tupleList);
    }
}

export namespace VectorBoolean
{
    export class Iterator
    {
        private readonly source_: VectorBoolean;
        private readonly index_: usize;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: VectorBoolean, index: usize)
        {
            this.source_ = source;
            this.index_ = index;
        }

        @inline
        public reverse(): ReverseIterator
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator
        {
            return this.advance(-1);
        }

        @inline
        public next(): Iterator
        {
            return this.advance(1);
        }

        @inline
        public advance(n: isize): Iterator
        {
            return this.source_.nth(this.index_ + n);
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): VectorBoolean
        {
            return this.source_;
        }

        @inline
        public index(): usize
        {
            return this.index_;
        }

        @inline
        public get value(): boolean
        {
            return this.source_.at(this.index_);
        }

        @inline
        public set value(val: boolean)
        {
            this.source_.set(this.index_, val);
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("==")
        public equals(obj: Iterator): boolean
        {
            return this.source_ === obj.source_ && this.index_ === obj.index_;
        }

        @inline
        @operator("<")
        public less(obj: Iterator): boolean
        {
            return this.index_ < obj.index_;
        }
        
        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator): boolean
        {
            return !this.equals(obj);
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: Iterator): boolean
        {
            return this.source_ === obj.source_ && this.index_ <= obj.index_;
        }

        @inline
        @operator(">")
        protected __greater(obj: Iterator): boolean
        {
            return this.index_ > obj.index_;
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: Iterator): boolean
        {
            return this.source_ === obj.source_ && this.index_ >= obj.index_;
        }
    }

    export class ReverseIterator
        extends ReverseIteratorBase<boolean, VectorBoolean, VectorBoolean, Iterator, ReverseIterator, boolean>
    {   
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */   
        @inline
        public advance(n: isize): ReverseIterator
        {
            return this.base().advance(-n).reverse();
        }

        @inline
        public index(): usize
        {
            return this.base().index();
        }

        @inline
        public get value(): boolean
        {
            return this.base_.value;
        }

        @inline
        public set value(val: boolean)
        {
            this.base_.value = val;
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        @operator("<")
        public less(obj: ReverseIterator): boolean
        {
            return this.index() > obj.index();
        }

        @inline
        @operator("<=")
        protected __less_equals(obj: ReverseIterator): boolean
        {
            return this.source() === obj.source() && this.index() >= obj.index();
        }

        @inline
        @operator(">")
        protected __greater(obj: ReverseIterator): boolean
        {
            return this.index() < obj.index();
        }

        @inline
        @operator(">=")
        protected __greater_equals(obj: ReverseIterator): boolean
        {
            return this.source() === obj.source() && this.index() <= obj.index();
        }
    }
}