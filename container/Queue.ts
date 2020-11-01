import { Deque } from "./Deque";

export class Queue<T>
{
    private container_: Deque<T>;

    public constructor()
    {
        this.container_ = new Deque();
    }

    public size(): usize
    {
        return this.container_.size();
    }

    public empty(): usize
    {
        return this.empty();
    }

    public front(): T
    {
        return this.container_.front();
    }

    public back(): T
    {
        return this.container_.back();
    }

    public pop(): void
    {
        this.container_.pop_front();
    }

    public push(value: T): void
    {
        this.container_.push_back(value);
    }
}