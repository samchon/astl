import { List } from "./List";

export class Queue<T>
{
    private container_: List<T>;

    public constructor()
    {
        this.container_ = new List();
    }

    @inline()
    public size(): usize
    {
        return this.container_.size();
    }

    @inline()
    public empty(): boolean
    {
        return this.container_.empty();
    }

    @inline()
    public front(): T
    {
        return this.container_.front();
    }

    @inline()
    public back(): T
    {
        return this.container_.back();
    }

    @inline()
    public pop(): void
    {
        this.container_.pop_front();
    }

    @inline()
    public push(value: T): void
    {
        this.container_.push_back(value);
    }
}