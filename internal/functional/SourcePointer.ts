export class SourcePointer<T extends object>
{
    public value: T;

    public constructor(value: T)
    {
        this.value = value;
    }
}