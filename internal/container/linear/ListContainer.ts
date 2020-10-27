import { IContainer } from "../../../base/container/IContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { ListIterator } from "../../iterator/ListIterator";
import { ListReverseIterator } from "../../iterator/ListReverseIterator";

import { Repeater } from "../../iterator/disposable/Repeater";
import { distance } from "../../../iterator/global";

export abstract class ListContainer<T extends ElemT, 
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends ListContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ListIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ReverseT extends ListReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    implements IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    private begin_: IteratorT;
    private end_: IteratorT;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.end_ = this._Create_iterator();
        this.begin_ = this.end_;
        this.size_ = 0;
    }
    
    public clear(): void
    {
        ListIterator._Set_prev(this.end_, this.end_);
        ListIterator._Set_next(this.end_, this.end_);
        
        this.begin_ = this.end_;
        this.size_ = 0;
    }

    protected abstract _Create_iterator(prev?: IteratorT, next?: IteratorT, value?: T): IteratorT;

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

    public begin(): IteratorT
    {
        return this.begin_;
    }

    public end(): IteratorT
    {
        return this.end_;
    }

    public rbegin(): ReverseT
    {
        return this.end_.reverse();
    }

    public rend(): ReverseT
    {
        return this.begin_.reverse();
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

    public insert(pos: IteratorT, val: T): IteratorT
    {
        const prev = pos.prev();
        const next = pos.next();

        const it = this._Create_iterator(prev, next, val);
        ListIterator._Set_next(prev, it);
        ListIterator._Set_prev(next, it);

        if (pos === this.begin_)
            this.begin_ = it;
        return it;
    }

    public insert_repeatedly(pos: IteratorT, n: usize, val: T): IteratorT
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n);

        return this.insert_range(pos, first, last);
    }

    public insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (pos: IteratorT, first: InputIterator, last: InputIterator): IteratorT
    {
        // PREPARE ASSETS
        let prev: IteratorT = pos.prev();
        let top: IteratorT | null = null;
        let size: usize = 0;

        // ITERATE THE NEW ELEMENTS
        for (; first != last; first = first.next())
        {
            const it: IteratorT = this._Create_iterator(prev, undefined, first.value);
            if (top === null)
                top = it;

            ListIterator._Set_next(prev, it);
            prev = it;
            ++size;
        }
        if (size === 0)
            return pos;

        // RETURNS WITH FINALIZATION
        ListIterator._Set_next(prev, top!);
        ListIterator._Set_prev(pos, top!);

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

    public erase(first: IteratorT, last: IteratorT = first.next()): IteratorT
    {
        const prev: IteratorT = first.prev();
        const length: usize = distance(first, last);

        ListIterator._Set_next(prev, last);
        ListIterator._Set_prev(last, prev);
        this.size_ -= length;

        return last;
    }

    /* ---------------------------------------------------------------
        SWAP
    --------------------------------------------------------------- */
    public swap(obj: ContainerT): void
    {
        // ITERATORS
        const begin: IteratorT = this.begin_;
        this.begin_ = obj.begin_;
        obj.begin_ = begin;

        const end: IteratorT = this.end_;
        this.end_ = obj.end_;
        obj.end_ = end;

        // CONTAINER SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }
}