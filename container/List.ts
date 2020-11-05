import { IForwardIterator } from "../iterator/IForwardIterator";
import { ReverseIterator as ReverseBase } from "../internal/iterator/ReverseIterator";

import { Repeater } from "../internal/iterator/disposable/Repeater";
import { SourcePointer } from "../internal/functional/SourcePointer";
import { distance } from "../iterator/global";
import { BinaryPredicator } from "../internal/functional/BinaryPredicator";
import { UnaryPredicator } from "../internal/functional/UnaryPredicator";
import { Comparator } from "../internal/functional/Comparator";

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

        ++this.size_;
        if (pos == this.begin_)
            this.begin_ = it;

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
        if (first == this.begin_)
            this.begin_ = last;

        return last;
    }

    /* ===============================================================
        ALGORITHMS
            - UNIQUE & REMOVE(_IF)
            - MERGE & SPLICE
            - SORT & SWAP
    ==================================================================
        UNIQUE & REMOVE(_IF)
    --------------------------------------------------------------- */
    public unique(pred: BinaryPredicator<T>): void
    {
        for (let it = this.begin().next(); it != this.end(); )
            if (pred(it.prev().value, it.value) === true)
                it = this.erase(it);
            else
                it = it.next();
    }

    @inline()
    public remove(val: T): void
    {
        for (let it = this.begin(); it != this.end(); )
            if (val === it.value)
                it = this.erase(it);
            else
                it = it.next();
    }

    public remove_if(pred: UnaryPredicator<T>): void
    {
        for (let it = this.begin(); it != this.end(); )
            if (pred(it.value) === true)
                it = this.erase(it);
            else
                it = it.next();
    }


    /* ---------------------------------------------------------
        MERGE & SPLICE
    --------------------------------------------------------- */
    public merge(source: List<T>, comp: Comparator<T>): void
    {
        if (this === source)
            return;

        let it = this.begin();
        while (source.empty() === false)
        {
            const first = source.begin();
            while (it != this.end() && comp(it.value, first.value) === true)
                it = it.next();

            this.splice(it, source, first);
        }
    }

    // public splice(pos: List.Iterator<T>, from: List<T>): void;
    // public splice(pos: List.Iterator<T>, from: List<T>, it: List.Iterator<T>): void;
    // public splice(pos: List.Iterator<T>, from: List<T>, first: List.Iterator<T>, last: List.Iterator<T>): void;

    public splice
        (
            pos: List.Iterator<T>, 
            from: List<T>, 
            first: List.Iterator<T> = null!, 
            last: List.Iterator<T> = null!
        ): void
    {
        // DEFAULT PARAMETERS
        if (first === null)
        {
            first = from.begin();
            last = from.end();
        }
        else if (last === null)
            last = first.next();

        // DO SPLICE
        this.insert_range(pos, first, last);
        from.erase(first, last);
    }

    /* ---------------------------------------------------------
        SORT & SWAP
    --------------------------------------------------------- */
    public sort(comp: Comparator<T>): void
    {
        this._Quick_sort(this.begin(), this.end(), comp);
    }

    private _Quick_sort(first: List.Iterator<T>, last: List.Iterator<T>, comp: Comparator<T>): void
    {
        if (first != last && last != this.end() && first != last.next())
        {
            const temp: List.Iterator<T> = this._Quick_sort_partition(first, last, comp);

            this._Quick_sort(first, temp.prev(), comp);
            this._Quick_sort(temp.next(), last, comp);
        }
    }

    private _Quick_sort_partition(first: List.Iterator<T>, last: List.Iterator<T>, comp: Comparator<T>): List.Iterator<T>
    {
        const standard: T = last.value; // TO BE COMPARED
        let prev: List.Iterator<T> = first.prev(); // TO BE SMALLEST

        let it: List.Iterator<T> = first;
        for (; it != last; it = it.next())
            if (comp(it.value, standard))
            {
                prev = prev == this.end() ? first : prev.next();

                const value: T = prev.value;
                prev.value = it.value;
                it.value = value;
            }

        prev = prev == this.end() ? first : prev.next();

        const value: T = prev.value;
        prev.value = it.value;
        it.value = value;
    
        return prev;
    }

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
            this.value_ = changetype<T>(0);
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
            return this.source_ptr_.value;
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