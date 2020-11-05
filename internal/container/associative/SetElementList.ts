import { ISetContainer } from "./ISetContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { ReverseIterator as ReverseBase } from "../../iterator/ReverseIterator";
import { Repeater } from "../../iterator/disposable/Repeater";
import { distance } from "../../../iterator/global";

export class SetElementList<Key, 
        Unique extends boolean, 
        SourceT extends ISetContainer<Key, Unique, SourceT, 
            SetElementList<Key, Unique, SourceT>, 
            SetElementList.Iterator<Key, Unique, SourceT>, 
            SetElementList.ReverseIterator<Key, Unique, SourceT>>>
{
    private size_: usize = 0;
    private uid_: usize = 0;

    private source_: SourceT;
    private end_: SetElementList.Iterator<Key, Unique, SourceT> = SetElementList.Iterator._Create(this, this.uid_++);
    private begin_: SetElementList.Iterator<Key, Unique, SourceT> = this.end_;
    
    public constructor(source: SourceT)
    {
        this.source_ = source;
    }

    public clear(): void
    {
        SetElementList.Iterator._Set_prev(this.end_, this.end_);
        SetElementList.Iterator._Set_next(this.end_, this.end_);
        
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
    public source(): SourceT
    {
        return this.source_;
    }

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
    public begin(): SetElementList.Iterator<Key, Unique, SourceT>
    {
        return this.begin_;
    }

    @inline()
    public end(): SetElementList.Iterator<Key, Unique, SourceT>
    {
        return this.end_;
    }

    @inline()
    public rbegin(): SetElementList.ReverseIterator<Key, Unique, SourceT>
    {
        return this.end().reverse();
    }

    @inline()
    public rend(): SetElementList.ReverseIterator<Key, Unique, SourceT>
    {
        return this.begin().reverse();
    }

    @inline()
    public front(): Key
    {
        return this.begin().value;
    }

    @inline()
    public back(): Key
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
    public push_front(val: Key): void
    {
        this.insert(this.begin(), val);
    }

    @inline()
    public push_back(val: Key): void
    {
        this.insert(this.end(), val);
    }

    public insert(pos: SetElementList.Iterator<Key, Unique, SourceT>, value: Key): SetElementList.Iterator<Key, Unique, SourceT>
    {
        const prev: SetElementList.Iterator<Key, Unique, SourceT> = pos.prev();
        
        const it: SetElementList.Iterator<Key, Unique, SourceT> = SetElementList.Iterator._Create(this, this.uid_++, prev, pos);
        SetElementList.Iterator._Set_value<Key, Unique, SourceT>(it, value);
        SetElementList.Iterator._Set_next<Key, Unique, SourceT>(prev, it);
        SetElementList.Iterator._Set_prev<Key, Unique, SourceT>(pos, it);

        if (pos === this.begin_)
            this.begin_ = it;

        ++this.size_;
        return it;
    }

    public insert_repeatedly
        (pos: SetElementList.Iterator<Key, Unique, SourceT>, n: usize, val: Key): SetElementList.Iterator<Key, Unique, SourceT>
    {
        const first: Repeater<Key> = new Repeater(0, val);
        const last: Repeater<Key> = new Repeater(n, null!);

        return this.insert_range(pos, first, last);
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (pos: SetElementList.Iterator<Key, Unique, SourceT>, first: InputIterator, last: InputIterator): SetElementList.Iterator<Key, Unique, SourceT>
    {
        // PREPARE ASSETS
        let prev: SetElementList.Iterator<Key, Unique, SourceT> = pos.prev();
        let top: SetElementList.Iterator<Key, Unique, SourceT> | null = null;
        let size: usize = 0;

        // ITERATE THE NEW ELEMENTS
        for (; first != last; first = first.next())
        {
            const it: SetElementList.Iterator<Key, Unique, SourceT> = SetElementList.Iterator._Create(this, this.uid_++, prev, null);
            SetElementList.Iterator._Set_value<Key, Unique, SourceT>(it, first.value);

            if (top === null)
                top = it;

            SetElementList.Iterator._Set_next<Key, Unique, SourceT>(prev, it);
            prev = it;
            ++size;
        }
        if (size === 0)
            return pos;

        // RETURNS WITH FINALIZATION
        SetElementList.Iterator._Set_next<Key, Unique, SourceT>(prev, top!);
        SetElementList.Iterator._Set_prev<Key, Unique, SourceT>(pos, top!);

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

    public erase(first: SetElementList.Iterator<Key, Unique, SourceT>, last: SetElementList.Iterator<Key, Unique, SourceT> = first.next()): SetElementList.Iterator<Key, Unique, SourceT>
    {
        const prev: SetElementList.Iterator<Key, Unique, SourceT> = first.prev();
        const length: usize = distance(first, last);

        SetElementList.Iterator._Set_next<Key, Unique, SourceT>(prev, last);
        SetElementList.Iterator._Set_prev<Key, Unique, SourceT>(last, prev);
        this.size_ -= length;

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: SetElementList<Key, Unique, SourceT>): void
    {
    }
}

export namespace SetElementList
{
    export class Iterator<Key, 
            Unique extends boolean, 
            SourceT extends ISetContainer<Key, Unique, SourceT, 
                SetElementList<Key, Unique, SourceT>, 
                Iterator<Key, Unique, SourceT>, 
                ReverseIterator<Key, Unique, SourceT>>>
    {
        private readonly container_: SetElementList<Key, Unique, SourceT>;
        private readonly uid_: usize;
        private erased_: boolean;
        
        private prev_: Iterator<Key, Unique, SourceT> | null;
        private next_: Iterator<Key, Unique, SourceT> | null;
        private value_: Key;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        private constructor(container: SetElementList<Key, Unique, SourceT>, uid: usize)
        {
            this.container_ = container;
            this.uid_ = uid;
            this.erased_ = false;

            this.prev_ = null;
            this.next_ = null;
            this.value_ = changetype<Key>(0);
        }

        public static _Create<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (
                container: SetElementList<Key, Unique, SourceT>, 
                uid: usize,
                prev: Iterator<Key, Unique, SourceT> | null = null, 
                next: Iterator<Key, Unique, SourceT> | null = null
            ): Iterator<Key, Unique, SourceT>
        {
            const ret: Iterator<Key, Unique, SourceT> = new Iterator(container, uid);
            if (prev) ret.prev_ = prev;
            if (next) ret.next_ = next;
            
            return ret;
        }

        @inline()
        public static _Set_prev<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (it: Iterator<Key, Unique, SourceT>, prev: Iterator<Key, Unique, SourceT>): void
        {
            it.prev_ = prev;
        }

        @inline()
        public static _Set_next<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (it: Iterator<Key, Unique, SourceT>, next: Iterator<Key, Unique, SourceT>): void
        {
            it.next_ = next;
        }

        @inline()
        public static _Set_value<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (it: Iterator<Key, Unique, SourceT>, value: Key): void
        {
            it.value_ = value;;
        }

        /* ---------------------------------------------------------------
            ITERATORS
        --------------------------------------------------------------- */
        @inline()
        public reverse(): ReverseIterator<Key, Unique, SourceT>
        {
            return new ReverseIterator(this);
        }

        @inline()
        public prev(): Iterator<Key, Unique, SourceT>
        {
            return this.prev_ ? this.prev_! : this;
        }

        @inline()
        public next(): Iterator<Key, Unique, SourceT>
        {
            return this.next_ ? this.next_! : this;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        @inline()
        public source(): SourceT
        {
            return this.container_.source();
        }

        @inline()
        public get value(): Key
        {
            return this.value_;
        }

        @inline()
        public static _Is_erased<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (it: Iterator<Key, Unique, SourceT>): boolean
        {
            return it.erased_;
        }

        @inline()
        public static _Set_erased<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (it: Iterator<Key, Unique, SourceT>): void
        {
            it.erased_ = true;
        }

        @inline()
        public static _Compare_uid<Key, 
                Unique extends boolean, 
                SourceT extends ISetContainer<Key, Unique, SourceT, 
                    SetElementList<Key, Unique, SourceT>, 
                    Iterator<Key, Unique, SourceT>, 
                    ReverseIterator<Key, Unique, SourceT>>>
            (x: Iterator<Key, Unique, SourceT>, y: Iterator<Key, Unique, SourceT>): boolean
        {
            return x.uid_ < y.uid_;
        }
    }

    export class ReverseIterator<Key,
            Unique extends boolean, 
            SourceT extends ISetContainer<Key, Unique, SourceT, 
                SetElementList<Key, Unique, SourceT>, 
                Iterator<Key, Unique, SourceT>, 
                ReverseIterator<Key, Unique, SourceT>>>
        extends ReverseBase<Key, 
            SourceT, 
            SetElementList<Key, Unique, SourceT>, 
            Iterator<Key, Unique, SourceT>, 
            ReverseIterator<Key, Unique, SourceT>, 
            Key>
    {
        public get value(): Key
        {
            return this.base_.value;
        }
    }
}