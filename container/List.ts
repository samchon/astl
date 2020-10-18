import { Repeater } from "../internal/iterator/disposable/Repeater";
import { distance } from "../iterator/global";
import { IForwardIterator } from "../iterator/IForwardIterator";

export class List<T>
{
    private source_ptr_: SourcePtr<T>;
    private begin_: List.Iterator<T>;
    private end_: List.Iterator<T>;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.source_ptr_ = new SourcePtr(this);
        this.end_ = List.Iterator._Create(this.source_ptr_);
        this.begin_ = this.end_;
        this.size_ = 0;
    }
    
    public clear(): void
    {
        List.Iterator._Set_prev(this.end_, this.end_);
        List.Iterator._Set_next(this.end_, this.end_);

        this.begin_ = this.end_;
        this.size_ = 0;
    }

    /* ---------------------------------------------------------
        ACCCESSORS
    --------------------------------------------------------- */
    public size(): usize
    {
        return this.size_;
    }

    public empty(): boolean
    {
        return this.size() === 0;
    }

    public begin(): List.Iterator<T>
    {
        return this.begin_;
    }

    public end(): List.Iterator<T>
    {
        return this.end_;
    }

    public front(): T
    {
        return this.begin_.value;
    }

    public back(): T
    {
        return this.end_.prev().value;
    }

    /* ===============================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - SWAP
    ==================================================================
        INSERT
    --------------------------------------------------------------- */
    public push_front(val: T): void
    {
        this.insert(this.begin(), val);
    }

    public push_back(val: T): void
    {
        this.insert(this.end(), val);
    }

    public insert(pos: List.Iterator<T>, val: T): List.Iterator<T>
    {
        const prev = pos.prev();
        const next = pos.next();

        const it = List.Iterator._Create(this.source_ptr_, prev, next, val);
        List.Iterator._Set_next(prev, it);
        List.Iterator._Set_prev(next, it);

        if (pos === this.begin_)
            this.begin_ = it;
        return it;
    }

    public insert_repeatedly(pos: List.Iterator<T>, n: usize, val: T): List.Iterator<T>
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n);

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
            const it: List.Iterator<T> = List.Iterator._Create(this.source_ptr_, prev);
            it.value = first.value;

            if (top === null)
                top = it;

            List.Iterator._Set_next(prev, it);
            prev = it;
            ++size;
        }
        if (size === 0)
            return pos;

        // RETURNS WITH FINALIZATION
        List.Iterator._Set_next(prev, top!);
        List.Iterator._Set_prev(pos, top!);

        if (pos === this.begin_)
            this.begin_ = top!;

        this.size_ += size;
        return top!;
    }

    /* ---------------------------------------------------------------
        ERASE
    --------------------------------------------------------------- */
    public pop_front(): void
    {
        this.erase(this.begin());
    }

    public pop_back(): void
    {
        this.erase(this.end().prev());
    }

    public erase(first: List.Iterator<T>, last: List.Iterator<T> = first.next()): List.Iterator<T>
    {
        const prev: List.Iterator<T> = first.prev();
        const length: usize = distance(first, last);

        List.Iterator._Set_next(prev, last);
        List.Iterator._Set_prev(last, prev);
        this.size_ -= length;

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: List<T>): void
    {
        // SOURCE POINTER
        this.source_ptr_.value = obj;
        obj.source_ptr_.value = this;

        const source: SourcePtr<T> = this.source_ptr_;
        this.source_ptr_ = obj.source_ptr_;
        obj.source_ptr_ = source;

        // ITERATORS
        const begin: List.Iterator<T> = this.begin_;
        this.begin_ = obj.begin_;
        obj.begin_ = begin;

        const end: List.Iterator<T> = this.end_;
        this.end_ = obj.end_;
        obj.end_ = end;

        // CONTAINER SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }
}

export namespace List
{
    export class Iterator<T>
    {
        private source_ptr_: SourcePtr<T>;
        private prev_: Iterator<T>;
        private next_: Iterator<T>;
        private erased_: boolean;

        private value_: T | undefined;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        private constructor(sourcePtr: SourcePtr<T>, prev?: Iterator<T>, next?: Iterator<T>, value?: T)
        {
            this.source_ptr_ = sourcePtr;
            this.prev_ = this.prev_ ? this.prev_ : this;
            this.next_ = this.next_ ? this.next_ : this;
            this.erased_ = false;

            this.value_ = value;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        public source(): List<T>
        {
            return this.source_ptr_.value;
        }

        public prev(): Iterator<T>
        {
            return this.prev_;
        }

        public next(): Iterator<T>
        {
            return this.next_;
        }

        public get value(): T
        {
            return this.value_!;
        }

        public set value(val: T)
        {
            this.value_ = val;
        }

        /* ---------------------------------------------------------------
            HIDDEN METHODS
        --------------------------------------------------------------- */
        @inline()
        public static _Create<T>(sourcePtr: SourcePtr<T>, prev?: Iterator<T>, next?: Iterator<T>, value?: T): Iterator<T>
        {
            return new Iterator(sourcePtr, prev, next, value);
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

        public static _Is_erased<T>(it: Iterator<T>): boolean
        {
            return it.erased_;
        }

        public static _Set_erased<T>(it: Iterator<T>): void
        {
            it.erased_ = true;
        }
    }
}

class SourcePtr<T>
{
    public value: List<T>;

    public constructor(value: List<T>)
    {
        this.value = value;
    }
}