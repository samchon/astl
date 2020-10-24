export declare interface IPointer<T>
{
    value: T;
}

export namespace IPointer
{
    export declare type ValueType<Pointer extends IPointer<any>> = 
        Pointer extends IPointer<infer T>
            ? T
            : unknown;
}