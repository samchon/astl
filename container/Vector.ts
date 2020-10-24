import { VectorContainer } from "../internal/container/linear/VectorContainer";
import { ArrayIterator } from "../internal/iterator/ArrayIterator";
import { ArrayReverseIterator } from "../internal/iterator/ArrayReverseIterator";

export class Vector<T>
    extends VectorContainer<T, Vector<T>, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>, T>
{
    public nth(index: usize): Vector.Iterator<T>
    {
        return new Vector.Iterator(this, index);
    }
}

export namespace Vector
{
    export class Iterator<T>
        extends ArrayIterator<T, Vector<T>, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>, T>
    {
        public reverse(): ReverseIterator<T>
        {
            return new ReverseIterator(this);
        }

        public source(): Vector<T>
        {
            return this.container_;
        }

        public get value(): T
        {
            return this.container_.at(this.index_);
        }

        public set value(val: T)
        {
            this.container_.set(this.index_, val);
        }
    }

    export class ReverseIterator<T>
        extends ArrayReverseIterator<T, Vector<T>, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>, T>
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