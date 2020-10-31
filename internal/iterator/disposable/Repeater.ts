export class Repeater<T>
{
    private index_: usize;
    private value_: T;

    public constructor(index: usize, value: T)
    {
        this.index_ = index;
        this.value_ = value;
    }

    public index(): usize
    {
        return this.index_;
    }

    public get value(): T
    {
        return this.value_;
    }

    public next(): Repeater<T>
    {
        ++this.index_;
        return this;
    }

    public static equals<T>(x: Repeater<T>, y: Repeater<T>): boolean
    {
        return x.index_ === y.index_;
    }
}