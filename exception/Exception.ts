export class Exception extends Error
{
    public constructor(message: string)
    {
        super(message);
    }

    @inline()
    public what(): string
    {
        return this.message;
    }
}