import { ListContainer } from "../internal/container/linear/ListContainer";
import { ListIterator } from "../internal/iterator/ListIterator";
import { ListReverseIterator } from "../internal/iterator/ListReverseIterator";

export class List<T> 
    extends ListContainer<T, List<T>, List<T>, List.Iterator<T>, List.ReverseIterator<T>, T>
{
    private source_ptr_: SourcePtr<T>;

    public constructor()
    {
        super();
        this.source_ptr_ = new SourcePtr(this);
    }

    protected _Create_iterator(prev?: List.Iterator<T>, next?: List.Iterator<T>, value?: T): List.Iterator<T>
    {
        return new List.Iterator(this.source_ptr_, prev, next, value);
    }

    public swap(obj: List<T>): void
    {
        // SOURCE POINTER
        this.source_ptr_.value = obj;
        obj.source_ptr_.value = this;

        const source: SourcePtr<T> = this.source_ptr_;
        this.source_ptr_ = obj.source_ptr_;
        obj.source_ptr_ = source;

        // SWAP ITERATORS
        super.swap(obj);
    }
}

export namespace List
{
    export class Iterator<T> 
        extends ListIterator<T, List<T>, List<T>, Iterator<T>, ReverseIterator<T>, T>
    {
        private source_ptr_: SourcePtr<T>;

        public constructor(sourcePtr: SourcePtr<T>, prev?: Iterator<T>, next?: Iterator<T>, value?: T)
        {
            super(prev, next, value);
            this.source_ptr_ = sourcePtr;
        }

        public source(): List<T>
        {
            return this.source_ptr_.value;
        }

        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        public get value(): T
        {
            return this.value_!;
        }

        public set value(val: T)
        {
            this.value_ = val;
        }
    }

    export class ReverseIterator<T> 
        extends ListReverseIterator<T, List<T>, List<T>, Iterator<T>, ReverseIterator<T>, T>
    {
        protected _Create_neighbor(base: Iterator<T>): ReverseIterator<T>
        {
            return new ReverseIterator(base);
        }

        public get value(): T
        {
            return this.base().value;
        }

        public set value(val: T)
        {
            this.base().value = val;
        }
    }
}

class SourcePtr<T>
{
    public value: List<T>;

    public constructor(value: List<T>)
    {
        this.value = value;
    }
}