export class Repeater<T>
{
    private index_: usize;
    private readonly value_: T;

    public constructor(index: usize, value: T)
    {
        this.index_ = index;
        this.value_ = value;
    }

    @inline()
    public index(): usize
    {
        return this.index_;
    }

    @inline()
    public get value(): T
    {
        return this.value_;
    }

    @inline()
    public next(): Repeater<T>
    {
        ++this.index_;
        return this;
    }

    @operator("==")
    @inline()
    public equals(obj: Repeater<T>): boolean
    {
        const ret: boolean = this.index_ === obj.index_;
        if (ret === true)
            this.index_ = 0;
        return ret;
    }

    @operator("!=")
    @inline()
    public __non_equals(obj: Repeater<T>): boolean
    {
        return !this.equals(obj);
    }
}