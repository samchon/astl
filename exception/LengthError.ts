import { LogicError } from "./LogicError";

export class LengthError extends LogicError
{
    public constructor(message: string)
    {
        super(message);
    }
}