import { LogicError } from "./LogicError";

export class OutOfRange extends LogicError
{
    public constructor(message: string)
    {
        super(message);
    }
}