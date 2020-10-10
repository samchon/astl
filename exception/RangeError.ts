import { RuntimeError } from "./RuntimeError";

export class RangeError extends RuntimeError
{
    public constructor(message: string)
    {
        super(message);
    }
}