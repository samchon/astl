import { IContainer } from "../../../base/container/IContainer";
import { IArrayContainer } from "../../../base/container/IArrayContainer";

import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { ArrayIterator } from "../../iterator/ArrayIterator";
import { ArrayReverseIterator } from "../../iterator/ArrayReverseIterator";

import { CMath } from "../../numeric/CMath";
import { ErrorGenerator } from "../../exception/ErrorGenerator";
import { Repeater } from "../../iterator/disposable/Repeater";
import { distance } from "../../../iterator/global";

export abstract class VectorContainer<T extends ElemT,
        SourceT extends IContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ContainerT extends VectorContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ArrayIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends ArrayReverseIterator<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>,
        ElemT>
    implements IArrayContainer<T, SourceT, ContainerT, IteratorT, ReverseT, ElemT>
{
    private data_: StaticArray<T>;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.size_ = 0;
        this.data_ = new StaticArray(1);
    }

    public clear(): void
    {
        this.size_ = 0;
        this.data_ = new StaticArray(1);
    }

    public resize(n: usize): void
    {
        this._Reserve(n, n);
    }

    public reserve(capacity: usize): void
    {
        this._Reserve(capacity, this.size());
    }

    public shrink_to_fit(): void
    {
        if (this.empty() === false && this.size() !== this.capacity())
            this.reserve(this.size());
    }

    private _Reserve(capacity: usize, limit: usize): void
    {
        const data: StaticArray<T> = new StaticArray(<i32>capacity);
        for (let i: usize = 0; i < limit; ++i)
            data[<i32>i] = this.data_[<i32>i];
        this.data_ = data;
    }

    private _Try_expand(plus: usize, limit: usize = this.size()): void
    {
        const required: usize = this.size() + plus;
        if (this.capacity() >= required)
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
    public capacity(): usize
    {
        return <usize>this.data_.length;
    }

    @inline()
    public data(): StaticArray<T>
    {
        return this.data_;
    }

    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    @inline()
    @operator("[]")
    public at(index: usize): T
    {
        ErrorGenerator.excessive("Vector.at()", index, this.size());
        return this.data_[<i32>index];
    }

    @inline()
    @operator("[]=")
    public set(index: usize, val: T): void
    {
        ErrorGenerator.excessive("Vector.set()", index, this.size());
        this.data_[<i32>index] = val;
    }
    
    @inline()
    public front(): T
    {
        return this.at(0);
    }

    @inline()
    public back(): T
    {
        return this.at(this.size() - 1);
    }

    /* ---------------------------------------------------------
        ITERATORS
    --------------------------------------------------------- */
    public abstract nth(index: usize): IteratorT;

    @inline()
    public begin(): IteratorT
    {
        return this.nth(0);
    }

    @inline()
    public end(): IteratorT
    {
        return this.nth(this.size());
    }

    public rbegin(): ReverseT
    {
        return this.end().reverse();
    }

    public rend(): ReverseT
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
    public push_back(val: T): void
    {
        this._Try_expand(1);
        this.data_[<i32>(this.size_++)] = val;
    }

    public insert(pos: IteratorT, val: T): IteratorT
    {
        return this.insert_repeatedly(pos, 1, val);
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
        const plus: usize = distance(first, last);
        this._Try_expand(plus, pos.index());

        for (let i: usize = pos.index(); i < this.size(); ++i)
        {
            this.data_[i + plus] = this.data_[i];
            this.data_[i] = first.value;
            first = first.next();
        }
        
        this.size_ += plus
        return pos;
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    public pop_back(): void
    {
        if (this.empty() === true)
            ErrorGenerator.empty("Vector.pop_back()");
        --this.size_;
    }

    public erase(first: IteratorT, last: IteratorT = first.next()): IteratorT
    {
        const distance: usize = last.index() - first.index();
        const limit: usize = CMath.min(this.size(), last.index() + distance);

        for (let i: usize = last.index(); i < limit; ++i)
            this.data_[i - distance] = this.data_[i];

        this.size_ -= distance;
        return first;
    }

    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    public swap(obj: ContainerT): void
    {
        // DATA
        const data: StaticArray<T> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SIZE
        const size: usize = this.size_;
        this.size_ = obj.size_;
        obj.size_ = size;
    }
}