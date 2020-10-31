import { Color } from "./Color";

export class XTreeNode<T>
{
    public parent: XTreeNode<T> | null;
    public left: XTreeNode<T> | null;
    public right: XTreeNode<T> | null;

    public value: T;
    public color: Color;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(value: T, color: Color)
    {
        this.value = value;
        this.color = color;
        
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    @inline()
    public get grand(): XTreeNode<T> | null
    {
        return this.parent!.parent;
    }

    @inline()
    public get sibling(): XTreeNode<T>  | null
    {
        return this === this.parent!.left
            ? this.parent!.right
            : this.parent!.left;
    }
 
    @inline()
    public get uncle(): XTreeNode<T>  | null
    {
        return this.parent!.sibling;
    }
}