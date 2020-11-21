import { XTreeNode } from "./XTreeNode";

import { Comparator } from "../functional/Comparator";
import { XColor } from "./XColor";

export class MultiXTree<Key, Elem>
{
    private root_: XTreeNode<Elem> | null;

    private readonly key_getter_: (elem: Elem) => Key;
    private readonly key_comp_: Comparator<Key>;
    private readonly duplicate_comp_: Comparator<Elem>;

    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    public constructor
        (
            keyGetter: (elem: Elem) => Key, 
            keyComp: Comparator<Key>, 
            duplicateComp: Comparator<Elem>
        )
    {
        this.root_ = null;
        this.key_getter_ = keyGetter;
        this.key_comp_ = keyComp;
        this.duplicate_comp_ = duplicateComp;
    }

    @inline
    public clear(): void
    {
        this.root_ = null;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public root(): XTreeNode<Elem> | null
    {
        return this.root_;
    }

    @inline
    public key_getter(): (elem: Elem) => Key
    {
        return this.key_getter_;
    }

    @inline
    public key_comp(): Comparator<Key>
    {
        return this.key_comp_;
    }

    private value_comp(x: Elem, y: Elem): boolean
    {
        const ret: boolean = this.key_comp_(this.key_getter_(x), this.key_getter_(y));
        if (ret === false && this.key_comp_(this.key_getter_(y), this.key_getter_(x)) === false)
            return this.duplicate_comp_(x, y);
        else
            return ret;
    }

    @inline
    private value_eq(x: Elem, y: Elem): boolean
    {
        return this.value_comp(x, y) === false && this.value_comp(y, x) === false;
    }

    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    @inline
    public nearest(key: Key): XTreeNode<Elem> | null
    {
        return this.nearest_with_mover(key, node => node.left);
    }

    protected nearest_with_mover(key: Key, equalMover: (node: XTreeNode<Elem>) => XTreeNode<Elem> | null): XTreeNode<Elem> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: XTreeNode<Elem> = this.root_!;
        let matched: XTreeNode<Elem> | null = null;

        while (true)
        {
            const candidate: Elem = ret.value;
            let child: XTreeNode<Elem> | null = null;

            // COMPARE
            if (this.key_comp_(key, this.key_getter_(candidate)))
                child = ret.left;
            else if (this.key_comp_(this.key_getter_(candidate), key))
                child = ret.right;
            else
            {
                matched = ret;
                child = equalMover(ret);
            }

            // ULTIL CHILD NODE EXISTS
            if (child === null)
                break;
            ret = child;
        }

        // RETURNS -> MATCHED OR NOT
        // return matched !== null ? matched : ret;
        if (matched !== null)
            return matched;
        else
            return ret;
    }

    private nearest_value(elem: Elem): XTreeNode<Elem> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: XTreeNode<Elem> = this.root_!;

        while (true) // UNTIL MEET THE MATCHED VALUE OR FINAL BRANCH
        {
            let child: XTreeNode<Elem> | null = null;

            // COMPARE
            if (this.value_comp(elem, ret.value))
                child = ret.left;
            else if (this.value_comp(ret.value, elem))
                child = ret.right;
            else
                return ret; // MATCHED VALUE

            // FINAL BRANCH? OR KEEP GOING
            if (child !== null)
                ret = child;
            else
                break;
        }
        return ret; // DIFFERENT NODE
    }

    private _Fetch_maximum(node: XTreeNode<Elem>): XTreeNode<Elem>
    {
        while (node.right !== null)
            node = node.right!;
        return node;
    }

    private find_value(value: Elem): XTreeNode<Elem> | null
    {
        const ret = this.nearest_value(value);
        if (ret === null || !this.value_eq(value, ret.value))
            return null;
        else
            return ret;
    }

    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - COLOR
            - ROTATION
    ============================================================
        INSERT
    --------------------------------------------------------- */
    public insert(elem: Elem): void
    {
        const parent: XTreeNode<Elem> | null = this.nearest_value(elem);
        const node: XTreeNode<Elem> = new XTreeNode(elem, XColor.RED);

        if (parent === null)
            this.root_ = node;
        else
        {
            node.parent = parent;
            if (this.value_comp(node.value, parent.value))
                parent.left = node;
            else
                parent.right = node;
        }

        this._Insert_case1(node);
    }

    private _Insert_case1(n: XTreeNode<Elem>): void
    {
        if (n.parent === null)
            n.color = XColor.BLACK;
        else
            this._Insert_case2(n);
    }

    private _Insert_case2(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.parent) === XColor.BLACK)
            return;
        else
            this._Insert_case3(n);
    }

    private _Insert_case3(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.uncle) === XColor.RED)
        {
            n.parent!.color = XColor.BLACK;
            n.uncle!.color = XColor.BLACK;
            n.grand!.color = XColor.RED;

            this._Insert_case1(n.grand!);
        }
        else
            this._Insert_case4(n);
    }

    private _Insert_case4(n: XTreeNode<Elem>): void
    {
        if (n === n.parent!.right && n.parent === n.grand!.left)
        {
            this._Rotate_left(n.parent!);
            n = n.left!;
        }
        else if (n === n.parent!.left && n.parent === n.grand!.right)
        {
            this._Rotate_right(n.parent!);
            n = n.right!;
        }

        this._Insert_case5(n);
    }

    private _Insert_case5(n: XTreeNode<Elem>): void
    {
        n.parent!.color = XColor.BLACK;
        n.grand!.color = XColor.RED;

        if (n === n.parent!.left && n.parent === n.grand!.left)
            this._Rotate_right(n.grand!);
        else
            this._Rotate_left(n.grand!);
    }

    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    public erase(elem: Elem): void
    {
        let node: XTreeNode<Elem> | null = this.find_value(elem);
        if (node === null)
            return; // UNABLE TO FIND THE MATCHED NODE

        if (node.left !== null && node.right !== null)
        {
            const pred: XTreeNode<Elem> = this._Fetch_maximum(node.left!);

            node.value = pred.value;
            node = pred;
        }

        const child: XTreeNode<Elem> | null = (node.right === null) ? node.left : node.right;
        if (this._Fetch_color(node) === XColor.BLACK)
        {
            node.color = this._Fetch_color(child);
            this._Erase_case1(node);
        }
        this._Replace_node(node, child);

        if (this._Fetch_color(this.root_) === XColor.RED)
            this.root_!.color = XColor.BLACK;
    }

    private _Erase_case1(n: XTreeNode<Elem>): void
    {
        if (n.parent === null)
            return;
        else
            this._Erase_case2(n);
    }

    private _Erase_case2(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.sibling) === XColor.RED)
        {
            n.parent!.color = XColor.RED;
            n.sibling!.color = XColor.BLACK;

            if (n === n.parent!.left)
                this._Rotate_left(n.parent!);
            else
                this._Rotate_right(n.parent!);
        }

        this._Erase_case3(n);
    }

    private _Erase_case3(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.parent) === XColor.BLACK &&
            this._Fetch_color(n.sibling) === XColor.BLACK &&
            this._Fetch_color(n.sibling!.left) === XColor.BLACK &&
            this._Fetch_color(n.sibling!.right) === XColor.BLACK)
        {
            n.sibling!.color = XColor.RED;
            this._Erase_case1(n.parent!);
        }
        else
            this._Erase_case4(n);
    }

    private _Erase_case4(N: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(N.parent) === XColor.RED &&
            N.sibling !== null &&
            this._Fetch_color(N.sibling!) === XColor.BLACK &&
            this._Fetch_color(N.sibling!.left) === XColor.BLACK &&
            this._Fetch_color(N.sibling!.right) === XColor.BLACK)
        {
            N.sibling!.color = XColor.RED;
            N.parent!.color = XColor.BLACK;
        }
        else
            this._Erase_case5(N);
    }

    private _Erase_case5(n: XTreeNode<Elem>): void
    {
        if (n === n.parent!.left &&
            n.sibling !== null &&
            this._Fetch_color(n.sibling!) === XColor.BLACK &&
            this._Fetch_color(n.sibling!.left) === XColor.RED &&
            this._Fetch_color(n.sibling!.right) === XColor.BLACK)
        {
            n.sibling!.color = XColor.RED;
            n.sibling!.left!.color = XColor.BLACK;

            this._Rotate_right(n.sibling!);
        }
        else if (n === n.parent!.right &&
            n.sibling !== null &&
            this._Fetch_color(n.sibling!) === XColor.BLACK &&
            this._Fetch_color(n.sibling!.left) === XColor.BLACK &&
            this._Fetch_color(n.sibling!.right) === XColor.RED)
        {
            n.sibling!.color = XColor.RED;
            n.sibling!.right!.color = XColor.BLACK;

            this._Rotate_left(n.sibling!);
        }
        this._Erase_case6(n);
    }
    
    private _Erase_case6(n: XTreeNode<Elem>): void
    {
        n.sibling!.color = this._Fetch_color(n.parent);
        n.parent!.color = XColor.BLACK;

        if (n === n.parent!.left)
        {
            n.sibling!.right!.color = XColor.BLACK;
            this._Rotate_left(n.parent!);
        }
        else
        {
            n.sibling!.left!.color = XColor.BLACK;
            this._Rotate_right(n.parent!);
        }
    }

    /* ---------------------------------------------------------
        ROTATION
    --------------------------------------------------------- */
    private _Rotate_left(node: XTreeNode<Elem>): void
    {
        const right = node.right;
        this._Replace_node(node, right);

        node.right = right!.left;
        if (right!.left !== null)
            right!.left!.parent = node;

        right!.left = node;
        node.parent = right;
    }

    private _Rotate_right(node: XTreeNode<Elem>): void
    {
        const left = node.left;
        this._Replace_node(node, left);

        node.left = left!.right;
        if (left!.right !== null)
            left!.right!.parent = node;

        left!.right = node;
        node.parent = left;
    }

    private _Replace_node(oldNode: XTreeNode<Elem>, newNode: XTreeNode<Elem> | null): void
    {
        if (oldNode.parent === null)
            this.root_ = newNode;
        else
        {
            if (oldNode === oldNode.parent!.left)
                oldNode.parent!.left = newNode;
            else
                oldNode.parent!.right = newNode;
        }

        if (newNode !== null)
            newNode.parent = oldNode.parent;
    }

    /* ---------------------------------------------------------
        COLOR
    --------------------------------------------------------- */
    private _Fetch_color(node: XTreeNode<Elem> | null): XColor
    {
        return (node !== null) 
            ? node.color 
            : XColor.BLACK;
    }
}