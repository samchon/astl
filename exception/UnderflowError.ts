import { RuntimeError } from "./RuntimeError";

export class UnderflowError extends RuntimeError
{
    public constructor(message: string)
    {
        super(message);
    }
}