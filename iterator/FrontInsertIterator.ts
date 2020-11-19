import { IPushFront } from "../internal/container/partial/IPushFront";

export class FrontInsertIterator<Container extends IPushFront<T>, T>
{
    private readonly data_: Container;

    public constructor(data: Container)
    {
        this.data_ = data;
    }

    @inline
    public next(): FrontInsertIterator<Container, T>
    {
        return this;
    }

    @inline
    public set value(val: T)
    {
        this.data_.push_front(val);
    }

    @inline
    @operator("==")
    public equals(obj: FrontInsertIterator<Container, T>): boolean
    {
        return this.data_ == obj.data_;
    }

    @inline
    @operator("!=")
    protected __non_equals(obj: FrontInsertIterator<Container, T>): boolean
    {
        return this.equals(obj) === false;
    }
}