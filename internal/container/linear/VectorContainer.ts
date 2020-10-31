import { distance } from "../../../iterator/global";
import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { ErrorGenerator } from "../../exception/ErrorGenerator";
import { Repeater } from "../../iterator/disposable/Repeater";
import { CMath } from "../../numeric/CMath";

export class VectorContainer<T>
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

    @inline()
    public resize(n: usize): void
    {
        this._Reserve(n, n);
    }

    @inline()
    public reserve(capacity: usize): void
    {
        this._Reserve(capacity, this.size());
    }

    @inline()
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
    
    @inline()
    @operator("[]")
    public at(index: usize): T
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("VectorContainer.at()", index, this.size());
        return this.data_[<i32>index];
    }

    @inline()
    @operator("[]=")
    public set(index: usize, val: T): void
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("VectorContainer.set()", index, this.size());
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

    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - SWAP
    ============================================================
        INSERT
    --------------------------------------------------------- */
    @inline()
    public push_back(val: T): void
    {
        this._Try_expand(1);
        this.data_[<i32>(this.size_++)] = val;
    }

    @inline()
    protected _Insert(index: usize, val: T): void
    {
        this._Insert_repeatedly(index, 1, val);
    }

    @inline()
    protected _Insert_repeatedly(index: usize, n: usize, val: T): void
    {
        const first: Repeater<T> = new Repeater(0, val);
        const last: Repeater<T> = new Repeater(n, val);

        this._Insert_range(index, first, last);
    }

    protected _Insert_range<InputIterator extends IForwardIterator<T, InputIterator>>
        (index: usize, first: InputIterator, last: InputIterator): void
    {
        const length: usize = distance(first, last);
        this._Try_expand(length, index);

        for (let i: usize = index; i < this.size(); ++i)
        {
            this.data_[i + length] = this.data_[i];
            this.data_[i] = first.value;
            first = first.next();
        }
        this.size_ += length
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    @inline()
    public pop_back(): void
    {
        --this.size_;
    }

    protected _Erase(first: usize, last: usize): void
    {
        const length: usize = last - first;
        const limit: usize = CMath.min(this.size(), last + length);

        for (let i: usize = last; i < limit; ++i)
            this.data_[i - length] = this.data_[i];

        this.size_ -= length;
    }

    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    protected _Swap(obj: VectorContainer<T>): void
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