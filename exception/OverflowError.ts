import { RuntimeError } from "./RuntimeError";

export class OverflowError extends RuntimeError
{
    public constructor(message: string)
    {
        super(message);
    }
}