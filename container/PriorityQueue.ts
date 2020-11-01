import { Comparator } from "../internal/functional/Comparator";
import { TreeMultiSet } from "./TreeMultiSet";

export class PriorityQueue<T>
{
    private container_: TreeMultiSet<T>;
    private comp_: Comparator<T>;

    public construtor(comp: Comparator<T>)
    {
        this.container_ = new TreeMultiSet(comp);
        this.comp_ = comp;
    }

    public value_comp(): Comparator<T>
    {
        return this.comp_;
    }
    
    public top(): T
    {
        return this.container_.end().prev().value;
    }

    public push_back(elem: T): void
    {
        this.container_.insert(elem);
    }

    public pop(): void
    {
        this.container_.erase(this.container_.begin());
    }
}