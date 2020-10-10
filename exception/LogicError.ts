import { Exception } from "./Exception";

export class LogicError extends Exception
{
    public constructor(message: string)
    {
        super(message);
    }
}