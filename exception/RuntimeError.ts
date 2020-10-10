import { Exception } from "./Exception";

export class RuntimeError extends Exception
{
    public constructor(message: string)
    {
        super(message);
    }
}