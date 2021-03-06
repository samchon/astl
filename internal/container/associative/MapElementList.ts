import { IMapContainer } from "./IMapContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { ReverseIteratorBase as ReverseBase } from "../../iterator/ReverseIteratorBase";

import { IPair } from "../../../utility/IPair";
import { Entry } from "../../../utility/Entry";
import { Repeater } from "../../iterator/disposable/Repeater";
import { distance } from "../../../iterator/global";

export class MapElementList<Key, T, 
        Unique extends boolean, 
        SourceT extends IMapContainer<Key, T, Unique, SourceT, 
            MapElementList.Iterator<Key, T, Unique, SourceT>, 
            MapElementList.ReverseIterator<Key, T, Unique, SourceT>>>
{
    private size_: usize = 0;
    private sequence_: usize = 0;

    private source_: SourceT;
    private end_: MapElementList.Iterator<Key, T, Unique, SourceT> = MapElementList.Iterator._Create(this, this.sequence_++, null, null, changetype<Entry<Key, T>>(0));
    private begin_: MapElementList.Iterator<Key, T, Unique, SourceT> = this.end_;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(source: SourceT)
    {
        this.source_ = source;
    }

    public clear(): void
    {
        MapElementList.Iterator._Set_prev<Key, T, Unique, SourceT>(this.end_, this.end_);
        MapElementList.Iterator._Set_next<Key, T, Unique, SourceT>(this.end_, this.end_);
        
        this.begin_ = this.end_;
        this.size_ = 0;
    }

    /* ---------------------------------------------------------
        ACCCESSORS
    --------------------------------------------------------- */
    @inline
    public source(): SourceT
    {
        return this.source_;
    }

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
    public begin(): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        return this.begin_;
    }

    @inline
    public end(): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        return this.end_;
    }

    @inline
    public rbegin(): MapElementList.ReverseIterator<Key, T, Unique, SourceT>
    {
        return this.end().reverse();
    }

    @inline
    public rend(): MapElementList.ReverseIterator<Key, T, Unique, SourceT>
    {
        return this.begin().reverse();
    }

    @inline
    public front(): Entry<Key, T>
    {
        return this.begin().value;
    }

    @inline
    public back(): Entry<Key, T>
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
    @inline
    public push_front(val: Entry<Key, T>): void
    {
        this.insert(this.begin(), val);
    }

    @inline
    public push_back(val: Entry<Key, T>): void
    {
        this.insert(this.end(), val);
    }

    public insert(pos: MapElementList.Iterator<Key, T, Unique, SourceT>, value: Entry<Key, T>): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        const prev: MapElementList.Iterator<Key, T, Unique, SourceT> = pos.prev();
        
        const it: MapElementList.Iterator<Key, T, Unique, SourceT> = MapElementList.Iterator._Create(this, this.sequence_++, prev, pos, value);
        MapElementList.Iterator._Set_next<Key, T, Unique, SourceT>(prev, it);
        MapElementList.Iterator._Set_prev<Key, T, Unique, SourceT>(pos, it);

        if (pos === this.begin_)
            this.begin_ = it;

        ++this.size_;
        return it;
    }

    public insert_repeatedly<InputT extends IPair<Key, T>>
        (pos: MapElementList.Iterator<Key, T, Unique, SourceT>, n: usize, val: InputT): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        const first: Repeater<InputT> = new Repeater(0, val);
        const last: Repeater<InputT> = new Repeater(n, null!);

        return this.insert_range(pos, first, last);
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (pos: MapElementList.Iterator<Key, T, Unique, SourceT>, first: InputIterator, last: InputIterator): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        // PREPARE ASSETS
        let prev: MapElementList.Iterator<Key, T, Unique, SourceT> = pos.prev();
        let top: MapElementList.Iterator<Key, T, Unique, SourceT> | null = null;
        let size: usize = 0;

        // ITERATE THE NEW ELEMENTS
        for (; first != last; first = first.next())
        {
            const entry: Entry<Key, T> = new Entry(first.value.first, first.value.second);
            const it: MapElementList.Iterator<Key, T, Unique, SourceT> = MapElementList.Iterator._Create(this, this.sequence_++, prev, null, entry);

            if (top === null)
                top = it;

            MapElementList.Iterator._Set_next(prev, it);
            prev = it;
            ++size;
        }
        if (size === 0)
            return pos;

        // RETURNS WITH FINALIZATION
        MapElementList.Iterator._Set_next(prev, top!);
        MapElementList.Iterator._Set_prev(pos, top!);

        if (pos === this.begin_)
            this.begin_ = top!;

        this.size_ += size;
        return top!;
    }

    /* ---------------------------------------------------------------
        ERASE
    --------------------------------------------------------------- */
    @inline
    public pop_front(): void
    {
        this.erase(this.begin());
    }

    @inline
    public pop_back(): void
    {
        this.erase(this.end().prev());
    }

    public erase(first: MapElementList.Iterator<Key, T, Unique, SourceT>, last: MapElementList.Iterator<Key, T, Unique, SourceT> = first.next()): MapElementList.Iterator<Key, T, Unique, SourceT>
    {
        const prev: MapElementList.Iterator<Key, T, Unique, SourceT> = first.prev();
        const length: usize = distance(first, last);

        MapElementList.Iterator._Set_next<Key, T, Unique, SourceT>(prev, last);
        MapElementList.Iterator._Set_prev<Key, T, Unique, SourceT>(last, prev);
        this.size_ -= length;

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: MapElementList<Key, T, Unique, SourceT>): void
    {
        const source: SourceT = this.source_;
        this.source_ = obj.source_;
        obj.source_ = source;
    }
}

export namespace MapElementList
{
    export class Iterator<Key, T, 
            Unique extends boolean, 
            SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                Iterator<Key, T, Unique, SourceT>, 
                ReverseIterator<Key, T, Unique, SourceT>>>
    {
        private readonly container_: MapElementList<Key, T, Unique, SourceT>;
        private readonly uid_: usize;
        private erased_: boolean;
        
        private prev_: Iterator<Key, T, Unique, SourceT> | null;
        private next_: Iterator<Key, T, Unique, SourceT> | null;
        private readonly value_: Entry<Key, T>;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        private constructor
            (
                container: MapElementList<Key, T, Unique, SourceT>, 
                uid: usize, 
                prev: Iterator<Key, T, Unique, SourceT> | null, 
                next: Iterator<Key, T, Unique, SourceT> | null,
                value: Entry<Key, T>
            )
        {
            this.container_ = container;
            this.uid_ = uid;
            this.erased_ = false;

            this.prev_ = prev;
            this.next_ = next;
            this.value_ = value;
        }

        @inline
        public static _Create<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (
                container: MapElementList<Key, T, Unique, SourceT>, 
                uid: usize,
                prev: Iterator<Key, T, Unique, SourceT> | null, 
                next: Iterator<Key, T, Unique, SourceT> | null,
                value: Entry<Key, T>
            ): Iterator<Key, T, Unique, SourceT>
        {
            return new Iterator(container, uid, prev, next, value);
        }

        @inline
        public static _Set_prev<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT,
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (it: Iterator<Key, T, Unique, SourceT>, prev: Iterator<Key, T, Unique, SourceT>): void
        {
            it.prev_ = prev;
        }

        @inline
        public static _Set_next<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT,
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (it: Iterator<Key, T, Unique, SourceT>, next: Iterator<Key, T, Unique, SourceT>): void
        {
            it.next_ = next;
        }

        /* ---------------------------------------------------------------
            ITERATORS
        --------------------------------------------------------------- */
        @inline
        public reverse(): ReverseIterator<Key, T, Unique, SourceT>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key, T, Unique, SourceT>
        {
            return this.prev_ ? this.prev_! : this;
        }

        @inline
        public next(): Iterator<Key, T, Unique, SourceT>
        {
            return this.next_ ? this.next_! : this;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        @inline
        public source(): SourceT
        {
            return this.container_.source();
        }

        @inline
        public get value(): Entry<Key, T>
        {
            return this.value_;
        }

        @inline
        public get first(): Key
        {
            return this.value.first;
        }

        @inline
        public get second(): T
        {
            return this.value.second;
        }

        @inline
        public set second(val: T)
        {
            this.value.second = val;
        }

        @inline
        public static _Is_erased<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (it: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return it.erased_;
        }

        @inline
        public static _Set_erased<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (it: Iterator<Key, T, Unique, SourceT>): void
        {
            it.erased_ = true;
        }

        @inline
        public static _Compare_uid<Key, T, 
                Unique extends boolean, 
                SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                    Iterator<Key, T, Unique, SourceT>, 
                    ReverseIterator<Key, T, Unique, SourceT>>>
            (x: Iterator<Key, T, Unique, SourceT>, y: Iterator<Key, T, Unique, SourceT>): boolean
        {
            return x.uid_ < y.uid_;
        }
    }

    export class ReverseIterator<Key, T,
            Unique extends boolean, 
            SourceT extends IMapContainer<Key, T, Unique, SourceT, 
                Iterator<Key, T, Unique, SourceT>, 
                ReverseIterator<Key, T, Unique, SourceT>>>
        extends ReverseBase<Entry<Key, T>, 
            SourceT, 
            Iterator<Key, T, Unique, SourceT>, 
            ReverseIterator<Key, T, Unique, SourceT>, 
            IPair<Key, T>>
    {
        @inline
        public get value(): Entry<Key, T>
        {
            return this.base_.value;
        }

        @inline
        public get first(): Key
        {
            return this.value.first;
        }

        @inline
        public get second(): T
        {
            return this.value.second;
        }

        @inline
        public set second(val: T)
        {
            this.value.second = val;
        }
    }
}