import { IPushFront } from "./IPushFront";

export declare interface IDeque<T> extends IPushFront<T>
{
    pop_front(): void;
}