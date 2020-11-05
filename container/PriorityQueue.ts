import { TreeMultiSet } from "./TreeMultiSet";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";

export class PriorityQueue<T>
{
    private readonly container_: TreeMultiSet<T>;
    private readonly comp_: Comparator<T>;

    public constructor(comp: Comparator<T> = (x, y) => less(x, y))
    {
        this.container_ = new TreeMultiSet(comp);
        this.comp_ = comp;
    }

    @inline()
    public data(): TreeMultiSet<T>
    {
        return this.container_;
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
    public value_comp(): Comparator<T>
    {
        return this.comp_;
    }
    
    @inline()
    public top(): T
    {
        return this.container_.end().prev().value;
    }

    @inline()
    public push_back(elem: T): void
    {
        this.container_.insert(elem);
    }

    @inline()
    public pop(): void
    {
        this.container_.erase(this.container_.end().prev());
    }
}