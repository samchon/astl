import { IPushBack } from "../internal/container/partial/IPushBack";

export class BackInsertIterator<Container extends IPushBack<T>, T>
{
    private readonly data_: Container;

    public constructor(data: Container)
    {
        this.data_ = data;
    }

    @inline()
    public next(): BackInsertIterator<Container, T>
    {
        return this;
    }

    public set value(val: T)
    {
        this.data_.push_back(val);
    }

    @inline()
    @operator("==")
    public equals(obj: BackInsertIterator<Container, T>): boolean
    {
        return this.data_ == obj.data_;
    }

    @inline()
    @operator("!=")
    public __non_equals(obj: BackInsertIterator<Container, T>): boolean
    {
        return this.equals(obj) === false;
    }
}