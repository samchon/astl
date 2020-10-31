import { IForwardIterator } from "../iterator/IForwardIterator";
import { ReverseIterator as ReverseBase } from "../internal/iterator/ReverseIterator";

import { Repeater } from "../internal/iterator/disposable/Repeater";
import { SourcePointer } from "../internal/functional/SourcePointer";
import { distance } from "../iterator/global";

export class List<T>
{
    // LAZY CONSTRUCTIONS
    private source_ptr_: SourcePointer<List<T>> = new SourcePointer(this);

    private end_: List.Iterator<T> = List.Iterator._Create(this.source_ptr_);
    private begin_: List.Iterator<T> = this.end_;
    private size_: usize = 0;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public clear(): void
    {
        List.Iterator._Set_prev<T>(this.end_, null!);
        List.Iterator._Set_next<T>(this.end_, null!);
        
        this.begin_ = this.end();
        this.size_ = 0;
    }

    public resize(n: usize): void
    {
        
    }

    /* ---------------------------------------------------------
        ACCCESSORS
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
    public begin(): List.Iterator<T>
    {
        return this.begin_;
    }

    @inline()
    public end(): List.Iterator<T>
    {
        return this.end_;
    }

    @inline()
    public rbegin(): List.ReverseIterator<T>
    {
        return this.end().reverse();
    }

    @inline()
    public rend(): List.ReverseIterator<T>
    {
        return this.begin().reverse();
    }

    @inline()
    public front(): T
    {
        return this.begin().value;
    }

    @inline()
    public back(): T
    {
        return this.end().prev().value;
    }

    /* ===============================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - SWAP
    ==================================================================
        INSERT
    --------------------------------------------------------------- */
    @inline()
    public push_front(val: T): void
    {
        this.insert(this.begin(), val);
    }

    @inline()
    public push_back(val: T): void
    {
        this.insert(this.end(), val);
    }

    public insert(pos: List.Iterator<T>, val: T): List.Iterator<T>
    {
        const prev: List.Iterator<T> = pos.prev();

        const it: List.Iterator<T> = List.Iterator._Create<T>(this.source_ptr_, prev, pos);
        List.Iterator._Set_next<T>(prev, it);
        List.Iterator._Set_prev<T>(pos, it);
        it.value = val;

        if (pos === this.begin_)
            this.begin_ = it;

        ++this.size_;
        return it;
    }

    public insert_repeatedly(pos: List.Iterator<T>, n: usize, val: T): List.Iterator<T>
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n, val);

        return this.insert_range(pos, first, last);
    }

    public insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: List.Iterator<T>, first: InputIterator, last: InputIterator): List.Iterator<T>
    {
        // PREPARE ASSETS
        let prev: List.Iterator<T> = pos.prev();
        let top: List.Iterator<T> | null = null;
        let size: usize = 0;

        // ITERATE THE NEW ELEMENTS
        for (; first != last; first = first.next())
        {
            const it: List.Iterator<T> = List.Iterator._Create<T>(this.source_ptr_, prev);
            it.value = first.value;

            if (top === null)
                top = it;

            List.Iterator._Set_next<T>(prev, it);
            prev = it;
            ++size;
        }
        if (size === 0)
            return pos;

        // RETURNS WITH FINALIZATION
        List.Iterator._Set_next<T>(prev, top!);
        List.Iterator._Set_prev<T>(pos, top!);

        if (pos === this.begin_)
            this.begin_ = top!;

        this.size_ += size;
        return top!;
    }

    /* ---------------------------------------------------------------
        ERASE
    --------------------------------------------------------------- */
    @inline()
    public pop_front(): void
    {
        this.erase(this.begin());
    }

    @inline()
    public pop_back(): void
    {
        this.erase(this.end().prev());
    }

    public erase(first: List.Iterator<T>, last: List.Iterator<T> = first.next()): List.Iterator<T>
    {
        const prev: List.Iterator<T> = first.prev();
        const length: usize = distance(first, last);

        List.Iterator._Set_next<T>(prev, last);
        List.Iterator._Set_prev<T>(last, prev);
        this.size_ -= length;

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: List<T>): void
    {
        //----
        // ELEMENTS
        //----
        // ITERATORS
        const begin: List.Iterator<T> = this.begin();
        this.begin_ = obj.begin_;
        obj.begin_ = begin;

        const end: List.Iterator<T> = this.end_;
        this.end_ = obj.end_;
        obj.end_ = end;

        // CONTAINER SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;

        //----
        // INDIRECT REFERENCE
        //----
        // SOURCE
        this.source_ptr_.value = obj;
        obj.source_ptr_.value = this;

        // SOURCE POINTER
        const ptr: SourcePointer<List<T>> = this.source_ptr_;
        this.source_ptr_ = obj.source_ptr_;
        obj.source_ptr_ = ptr;
    }
}

export namespace List
{
    export class Iterator<T> 
    {
        private readonly source_ptr_: SourcePointer<List<T>>;
        private erased_: boolean;
        
        private prev_: Iterator<T> | null;
        private next_: Iterator<T> | null;
        private value_: T;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        private constructor(sourcePtr: SourcePointer<List<T>>)
        {
            this.source_ptr_ = sourcePtr;
            this.erased_ = false;

            this.prev_ = null;
            this.next_ = null;
            
            if (isNullable<T>() === true)
                this.value_ = null!;
        }

        public static _Create<T>(sourcePtr: SourcePointer<List<T>>, prev: Iterator<T> | null = null, next: Iterator<T> | null = null): Iterator<T>
        {
            const ret: Iterator<T> = new Iterator(sourcePtr);
            if (prev) ret.prev_ = prev;
            if (next) ret.next_ = next;
            
            return ret;
        }

        @inline()
        public static _Set_prev<T>(it: Iterator<T>, prev: Iterator<T>): void
        {
            it.prev_ = prev;
        }

        @inline()
        public static _Set_next<T>(it: Iterator<T>, next: Iterator<T>): void
        {
            it.next_ = next;
        }

        /* ---------------------------------------------------------------
            ITERATORS
        --------------------------------------------------------------- */
        @inline()
        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        @inline()
        public prev(): Iterator<T>
        {
            return this.prev_ ? this.prev_! : this;
        }

        @inline()
        public next(): Iterator<T>
        {
            return this.next_ ? this.next_! : this;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        @inline()
        public source(): List<T>
        {
            return this.source_ptr_.value!;
        }

        @inline()
        public get value(): T
        {
            return this.value_;
        }
        public set value(val: T)
        {
            this.value_ = val;
        }

        @inline()
        public static _Is_erased<T>(it: Iterator<T>): boolean
        {
            return it.erased_;
        }

        @inline()
        public static _Set_erased<T>(it: Iterator<T>): void
        {
            it.erased_ = true;
        }
    }

    export class ReverseIterator<T> 
        extends ReverseBase<T, List<T>, List<T>, Iterator<T>, ReverseIterator<T>, T>
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