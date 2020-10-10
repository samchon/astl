import { LogicError } from "./LogicError";

export class DomainError extends LogicError
{
    public constructor(message: string)
    {
        super(message);
    }
}