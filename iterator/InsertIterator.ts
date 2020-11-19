export class InsertIterator<ContainerT, IteratorT, T>
{
    private readonly container_: ContainerT;
    private it_: IteratorT;

    public constructor(container: ContainerT, it: IteratorT)
    {
        this.container_ = container;
        this.it_ = it;
    }

    @inline
    public set value(val: T)
    {
        this.it_ = this.container_.insert(this.it_, val);
        this.it_ = this.it_.next();
    }

    @inline
    @operator("==")
    public equals(obj: InsertIterator<ContainerT, IteratorT, T>): boolean
    {
        return this.it_ == obj.it_;
    }

    @inline
    @operator("!=")
    protected __non_equals(obj: InsertIterator<ContainerT, IteratorT, T>): boolean
    {
        return this.equals(obj) === false;
    }
}