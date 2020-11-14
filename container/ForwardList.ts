import { IForwardIterator } from "../iterator/IForwardIterator";

import { DomainError } from "../exception/DomainError";

import { CMath } from "../internal/numeric/CMath";
import { Repeater } from "../internal/iterator/disposable/Repeater";
import { SourcePointer } from "../internal/functional/SourcePointer";
import { distance } from "../iterator/global";

export class ForwardList<T>
{
    private source_ptr_: SourcePointer<ForwardList<T>> = new SourcePointer(this);
    
    private end_: ForwardList.Iterator<T> = ForwardList.Iterator._Create(this.source_ptr_, null, changetype<T>(0));
    private before_begin_: ForwardList.Iterator<T> = ForwardList.Iterator._Create(this.source_ptr_, this.end_, changetype<T>(0));
    private size_: usize = 0;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    @inline()
    public assign_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_after_range<InputIterator>(this.before_begin_, first, last);
    }

    @inline()
    public assign_repeatedly(length: usize, value: T): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_after_repeatedly(this.before_begin_, length, value);
    }

    @inline()
    public clear(): void
    {
        ForwardList.Iterator._Set_next(this.before_begin_, this.end_);
        this.size_ = 0;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public size(): usize
    {
        return this.size_;
    }

    @inline()
    public empty(): boolean
    {
        return this.size_ === 0;
    }

    @inline()
    public front(): T
    {
        return this.begin().value;
    }

    @inline()
    public before_begin(): ForwardList.Iterator<T>
    {
        return this.before_begin_;
    }

    @inline()
    public begin(): ForwardList.Iterator<T>
    {
        return this.before_begin_.next();
    }

    @inline()
    public end(): ForwardList.Iterator<T>
    {
        return this.end_;
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
        this.insert_after(this.before_begin_, val);
    }

    public insert_after(pos: ForwardList.Iterator<T>, val: T): ForwardList.Iterator<T>
    {
        const it: ForwardList.Iterator<T> = ForwardList.Iterator._Create(this.source_ptr_, pos.next(), val);
        ForwardList.Iterator._Set_next<T>(pos, it);

        ++this.size_;
        return it;
    }

    @inline()
    public insert_after_repeatedly(pos: ForwardList.Iterator<T>, n: usize, val: T): ForwardList.Iterator<T>
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n, val);

        return this.insert_after_range(pos, first, last);
    }

    public insert_after_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: ForwardList.Iterator<T>, first: InputIterator, last: InputIterator): ForwardList.Iterator<T>
    {
        for (; first != last; first = first.next())
            pos = this.insert_after(pos, first.value);
        return pos;
    }

    /* ---------------------------------------------------------------
        ERASE
    --------------------------------------------------------------- */
    @inline()
    public pop_front(): void
    {
        this.erase_after(this.before_begin());
    }
    
    public erase_after(first: ForwardList.Iterator<T>, last: ForwardList.Iterator<T> = first.next().next()): ForwardList.Iterator<T>
    {
        this.size_ -= CMath.max<isize>(0, distance(first, last) - 1);
        ForwardList.Iterator._Set_next<T>(first, last);

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: ForwardList<T>): void
    {
        // SOURCE POINTER
        this.source_ptr_.value = obj;
        obj.source_ptr_.value = this;

        const source: SourcePointer<ForwardList<T>> = this.source_ptr_;
        this.source_ptr_ = obj.source_ptr_;
        obj.source_ptr_ = source;

        // ITERATORS
        const before: ForwardList.Iterator<T> = this.before_begin_;
        this.before_begin_ = obj.before_begin_;
        obj.before_begin_ = before;

        const end: ForwardList.Iterator<T> = this.end_;
        this.end_ = obj.end_;
        obj.end_ = end;

        // CONTAINER SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }
}

export namespace ForwardList
{
    export class Iterator<T>
    {
        private source_ptr_: SourcePointer<ForwardList<T>>;
        private next_: Iterator<T> | null;
        private value_: T;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        private constructor(sourcePtr: SourcePointer<ForwardList<T>>, next: Iterator<T> | null, value: T)
        {
            this.source_ptr_ = sourcePtr;
            this.next_ = next;
            this.value_ = value;
        }

        @inline()
        public static _Create<T>(sourcePtr: SourcePointer<ForwardList<T>>, next: Iterator<T> | null, value: T): ForwardList.Iterator<T>
        {
            return new Iterator(sourcePtr, next, value);
        }

        @inline()
        public static _Set_next<T>(it: Iterator<T>, next: Iterator<T>): void
        {
            it.next_ = next;
        }

        @inline()
        public next(): Iterator<T>
        {
            if (this.next_ === null)
                throw new DomainError("Error on ForwardList.Iterator.next(): unable to forward to the next step because it's the ForwardList.end().");
            return this.next_!;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        @inline()
        public source(): ForwardList<T>
        {
            return this.source_ptr_.value;
        }

        @inline()
        public get value(): T
        {
            return this.value_;
        }

        @inline()
        public set value(val: T)
        {
            this.value_ = val;
        }
    }
}