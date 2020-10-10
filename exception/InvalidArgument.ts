import { LogicError } from "./LogicError";

export class InvalidArgument extends LogicError
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