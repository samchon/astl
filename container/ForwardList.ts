import { IForwardIterator } from "../iterator/IForwardIterator";
import { Repeater } from "../internal/iterator/disposable/Repeater";
import { distance } from "../iterator/global";

export class ForwardList<T>
{
    private source_ptr_: SourcePtr<T>;
    private size_: usize;

    private readonly before_begin_: ForwardList.Iterator<T>;
    private readonly end_: ForwardList.Iterator<T>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.source_ptr_ = new SourcePtr(this);
        this.size_ = 0;

        this.end_ = new ForwardList.Iterator(this.source_ptr_, null!, undefined);
        this.before_begin_ = new ForwardList.Iterator(this.source_ptr_, this.end_, undefined);
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
        this.insert_after(this.before_begin(), val);
    }

    @inline()
    public insert_after(pos: ForwardList.Iterator<T>, val: T): ForwardList.Iterator<T>
    {
        const it: ForwardList.Iterator<T> = new ForwardList.Iterator(this.source_ptr_, pos.next(), val);
        ForwardList.Iterator.set_next(pos, it);

        ++this.size_;
        return it;
    }

    public insert_after_repeatedly(pos: ForwardList.Iterator<T>, n: usize, val: T): ForwardList.Iterator<T>
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n);

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

    public erase_after(it: ForwardList.Iterator<T>): ForwardList.Iterator<T>;
    public erase_after(first: ForwardList.Iterator<T>, last: ForwardList.Iterator<T>): ForwardList.Iterator<T>;

    public erase_after(first: ForwardList.Iterator<T>, last: ForwardList.Iterator<T> = first.next()): ForwardList.Iterator<T>
    {
        this.size_ -= distance(first, last);
        ForwardList.Iterator.set_next(first, last);

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
        private source_ptr_: SourcePtr<T>;
        private next_: Iterator<T> | null;
        private value_: T | undefined;

        public constructor(sourcePtr: SourcePtr<T>, next: Iterator<T> | null, value: T | undefined)
        {
            this.source_ptr_ = sourcePtr;
            this.next_ = next;
            this.value_ = value;
        }

        @inline()
        public static set_next<T>(it: Iterator<T>, next: Iterator<T>): void
        {
            it.next_ = next;
        }

        @inline()
        public source(): ForwardList<T>
        {
            return this.source_ptr_.value;
        }

        @inline()
        public get value(): T
        {
            return this.value_!;
        }

        public set value(val: T)
        {
            this.value_ = val;
        }

        public next(): Iterator<T>
        {
            if (this.next_ === null)
                throw new Error("Error on ForwardList.Iterator.next(): unable to forward to the next step because it's the ForwardList.end().");
            return this.next_;
        }
    }
}

class SourcePtr<T>
{
    public value: ForwardList<T>;

    public constructor(value: ForwardList<T>)
    {
        this.value = value;
    }
}