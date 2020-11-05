import { Vector } from "./Vector";

export class Stack<T>
{
    private container_: Vector<T>;

    public constructor()
    {
        this.container_ = new Vector<T>();
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
    public top(): T
    {
        return this.container_.back();
    }

    @inline()
    public pop(): void
    {
        this.container_.pop_back();
    }

    @inline()
    public push(value: T): void
    {
        this.container_.push_back(value);
    }
}

export namespace Stack
{
    export interface IContainer<T>
    {
        size(): usize;
        empty(): boolean;
        back(): T;

        pop_back(): void;
        push_back(value: T): void;
    }
}