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

    @inline
    public resize(n: usize): void
    {
        this._Reserve(n, n);
        this.size_ = n;
    }

    @inline
    public reserve(capacity: usize): void
    {
        this._Reserve(capacity, this.size());
    }

    @inline
    public shrink_to_fit(): void
    {
        if (this.empty() === false && this.size() !== this.capacity())
            this.reserve(this.size());
    }

    private _Reserve(capacity: usize, limit: usize): StaticArray<T>
    {
        const old: StaticArray<T> = this.data_;
        const data: StaticArray<T> = new StaticArray(<i32>capacity);

        for (let i: usize = 0; i < limit; ++i)
            data[<i32>i] = old[<i32>i];

        this.data_ = data;
        return old;
    }

    private _Try_expand(plus: usize, limit: usize = this.size()): StaticArray<T> | null
    {
        const required: usize = this.size() + plus;
        if (this.capacity() >= required)
            return null;
        
        const capacity: usize = CMath.max(required, this.capacity() * 2);
        return this._Reserve(capacity, limit);
    }

    private _Shift(index: usize, length: usize): void
    {
        if (index >= this.size())
            return;
        
        let i: usize = this.size() - 1;
        while (true)
        {
            this.data_[<i32>(i + length)] = this.data_[<i32>i];
            if (i === index)
                break;
            else
                --i;
        }
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
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
    public capacity(): usize
    {
        return <usize>this.data_.length;
    }

    @inline
    public data(): StaticArray<T>
    {
        return this.data_;
    }
    
    @inline
    @operator("[]")
    public at(index: usize): T
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("VectorContainer.at()", index, this.size());
        return this.data_[<i32>index];
    }

    @inline
    @operator("[]=")
    public set(index: usize, val: T): void
    {
        if (index >= this.size())
            throw ErrorGenerator.excessive("VectorContainer.set()", index, this.size());
        this.data_[<i32>index] = val;
    }
    
    @inline
    public front(): T
    {
        return this.at(0);
    }

    @inline
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
    @inline
    public push_back(val: T): void
    {
        this._Try_expand(1);
        this.data_[<i32>(this.size_++)] = val;
    }

    @inline
    protected _Insert(index: usize, val: T): void
    {
        this._Insert_repeatedly(index, 1, val);
    }

    @inline
    protected _Insert_repeatedly(index: usize, length: usize, value: T): void
    {
        const first: Repeater<T> = new Repeater(index, value);
        const last: Repeater<T> = new Repeater(index + length, value);

        this._Insert_range_with_length(index, first, last, length);
    }

    protected _Insert_range<InputIterator>
        (index: usize, first: InputIterator, last: InputIterator): void
    {
        const length: usize = distance(first, last);
        this._Insert_range_with_length(index, first, last, length);
    }

    private _Insert_range_with_length<InputIterator>
        (index: usize, first: InputIterator, last: InputIterator, length: usize): void
    {
        const old: StaticArray<T> | null = this._Try_expand(length, index);
        if (old !== null)
        {
            // INSERT RANGE
            for (; first != last; first = first.next())
                this.data_[<i32>(index++)] = first.value;
            
            // FILL TAIL VALUES
            const limit: usize = this.size() + length;
            for (; index < limit; ++index)
                this.data_[<i32>index] = old[<i32>(index - length)];
        }
        else
        {
            // SHIFT TAIL VALUES
            this._Shift(index, length);

            // INSERT RANGE
            for (; first != last; first = first.next())
                this.data_[<i32>(index++)] = first.value;
        }
        this.size_ += length;
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    @inline
    public pop_back(): void
    {
        --this.size_;
    }

    protected _Erase(first: usize, last: usize): void
    {
        if (first >= last)
            return;

        const length: usize = last - first;
        for (let i: usize = last; i < this.size(); ++i)
            this.data_[<i32>(i - length)] = this.data_[<i32>i];

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