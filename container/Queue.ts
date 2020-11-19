import { List } from "./List";

export class Queue<T>
{
    private data_: List<T>;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.data_ = new List();
    }

    @inline
    public pop(): void
    {
        this.data_.pop_front();
    }

    @inline
    public push(value: T): void
    {
        this.data_.push_back(value);
    }

    public swap(obj: Queue<T>): void
    {
        const data: List<T> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public size(): usize
    {
        return this.data_.size();
    }

    @inline
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline
    public front(): T
    {
        return this.data_.front();
    }

    @inline
    public back(): T
    {
        return this.data_.back();
    }
}