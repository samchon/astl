import { Vector } from "./Vector";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";
import { pop_heap, push_heap } from "../algorithm/heap";

export class PriorityQueue<T>
{
    private data_: Vector<T>;
    private comp_: Comparator<T>;

    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<T> = (x, y) => less(x, y))
    {
        this.data_ = new Vector();
        this.comp_ = comp;
    }

    @inline
    public push(elem: T): void
    {
        this.data_.push_back(elem);
        push_heap<Vector.Iterator<T>, Comparator<T, T>>(this.data_.begin(), this.data_.end(), this.comp_);
    }

    @inline
    public pop(): void
    {
        pop_heap<Vector.Iterator<T>, Comparator<T, T>>(this.data_.begin(), this.data_.end(), this.comp_);
        this.data_.pop_back();
    }

    public swap(obj: PriorityQueue<T>): void
    {
        const data: Vector<T> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;
        
        const comp: Comparator<T> = this.comp_;
        this.comp_ = obj.comp_;
        obj.comp_ = comp;
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
    public value_comp(): Comparator<T>
    {
        return this.comp_;
    }
    
    @inline
    public top(): T
    {
        return this.data_.front();
    }   
}