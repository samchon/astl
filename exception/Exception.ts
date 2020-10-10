export class Exception extends Error
{
    public constructor(message: string)
    {
        super(message);
    }

    public what(): string
    {
        return this.message;
    }
}