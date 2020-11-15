import { Vector } from "./Vector";

export class Stack<T>
{
    private data_: Vector<T>;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor()
    {
        this.data_ = new Vector<T>();
    }

    @inline()
    public pop(): void
    {
        this.data_.pop_back();
    }

    @inline()
    public push(value: T): void
    {
        this.data_.push_back(value);
    }

    public swap(obj: Stack<T>): void
    {
        const data: Vector<T> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public size(): usize
    {
        return this.data_.size();
    }

    @inline()
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline()
    public top(): T
    {
        return this.data_.back();
    }
}