import { Vector } from "./Vector";

export class Stack<T>
{
    private container_: Vector<T>;

    public constructor()
    {
        this.container_ = new Vector();
    }

    public size(): usize
    {
        return this.container_.size();
    }

    public empty(): usize
    {
        return this.empty();
    }

    public top(): T
    {
        return this.container_.back();
    }

    public pop(): void
    {
        this.container_.pop_back();
    }

    public push(value: T): void
    {
        this.container_.push_back(value);
    }
}