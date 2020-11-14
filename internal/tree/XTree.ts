import { XTreeNode } from "./XTreeNode";

import { Comparator } from "../functional/Comparator";
import { Color } from "./Color";

export class XTree<Key, Elem>
{
    protected root_: XTreeNode<Elem> | null;
    private readonly unique_: boolean;

    protected readonly fetcher_: (elem: Elem) => Key;
    private readonly key_comp_: Comparator<Key>;
    private readonly duplicate_comp_: ((x: Elem, y: Elem) => boolean) | null;

    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    public constructor
        (
            fetcher: (elem: Elem) => Key, 
            keyComp: Comparator<Key>, 
            duplicateComp: ((x: Elem, y: Elem) => boolean) | null = null,
        )
    { 
        this.root_ = null;
        this.unique_ = (duplicateComp === null);

        this.fetcher_ = fetcher;
        this.key_comp_ = keyComp;
        this.duplicate_comp_ = duplicateComp;
    }

    @inline()
    public clear(): void
    {
        this.root_ = null;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public root(): XTreeNode<Elem> | null
    {
        return this.root_;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.key_comp_;
    }

    private value_comp_(x: Elem, y: Elem): boolean
    {
        const ret: boolean = this.key_comp_(this.fetcher_(x), this.fetcher_(y));
        if (ret === false && 
            this.unique_ === false &&
            this.key_comp_(this.fetcher_(y), this.fetcher_(x)) === false)
            return this.duplicate_comp_!(x, y);
        else
            return ret;
    }

    @inline()
    private value_eq_(x: Elem, y: Elem): boolean
    {
        return !this.value_comp_(x, y) && !this.value_comp_(y, x);
    }

    /* =========================================================
        FINDERS
            - COMMON
            - UNIQUE
            - MULTI
    ============================================================
        COMMON
    --------------------------------------------------------- */
    public lower_bound(key: Key): XTreeNode<Elem> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: XTreeNode<Elem> = this.root_!;
        let matched: XTreeNode<Elem> | null = null;

        // UNTIL MEET THE MATCHED VALUE OR FINAL BRANCH
        while (true)
        {
            const candidate: Key = this.fetcher_(ret.value);
            let child: XTreeNode<Elem> | null = null;

            // COMPARE
            if (this.key_comp_(candidate, key) === true)
                child = ret.right;
            else if (this.key_comp_(candidate, key) === false)
            {
                matched = ret;
                child = ret.left;
            }
            else
                child = ret.left;
    
            // FINAL BRANCH? OR KEEP GOING
            if (child === null)
                break;
            ret = child;
        }

        // RETURNS
        if (matched !== null)
            return matched;
        else if (this.key_comp_(this.fetcher_(ret.value), key) === true)
            return null;
        else
            return ret;
    }
    
    private find_value(value: Elem): XTreeNode<Elem> | null
    {
        const ret = this.nearest_value(value);
        if (ret === null || !this.value_eq_(value, ret.value))
            return null;
        else
            return ret;
    }
    
    private nearest_value(value: Elem): XTreeNode<Elem> | null
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
            if (this.value_comp_(value, ret.value))
                child = ret.left;
            else if (this.value_comp_(ret.value, value))
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

    @inline()
    private _Fetch_maximum(node: XTreeNode<Elem>): XTreeNode<Elem>
    {
        while (node.right !== null)
            node = node.right!;
        return node;
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
        const node: XTreeNode<Elem> = new XTreeNode(elem, Color.RED);

        if (parent === null)
            this.root_ = node;
        else
        {
            node.parent = parent;
            if (this.value_comp_(node.value, parent.value))
                parent.left = node;
            else
                parent.right = node;
        }

        this._Insert_case1(node);
    }

    private _Insert_case1(n: XTreeNode<Elem>): void
    {
        if (n.parent === null)
            n.color = Color.BLACK;
        else
            this._Insert_case2(n);
    }

    private _Insert_case2(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.parent) === Color.BLACK)
            return;
        else
            this._Insert_case3(n);
    }

    private _Insert_case3(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.uncle) === Color.RED)
        {
            n.parent!.color = Color.BLACK;
            n.uncle!.color = Color.BLACK;
            n.grand!.color = Color.RED;

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
        n.parent!.color = Color.BLACK;
        n.grand!.color = Color.RED;

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
        if (this._Fetch_color(node) === Color.BLACK)
        {
            node.color = this._Fetch_color(child);
            this._Erase_case1(node);
        }
        this._Replace_node(node, child);

        if (this._Fetch_color(this.root_) === Color.RED)
            this.root_!.color = Color.BLACK;
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
        if (this._Fetch_color(n.sibling) === Color.RED)
        {
            n.parent!.color = Color.RED;
            n.sibling!.color = Color.BLACK;

            if (n === n.parent!.left)
                this._Rotate_left(n.parent!);
            else
                this._Rotate_right(n.parent!);
        }

        this._Erase_case3(n);
    }

    private _Erase_case3(n: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(n.parent) === Color.BLACK &&
            this._Fetch_color(n.sibling) === Color.BLACK &&
            this._Fetch_color(n.sibling!.left) === Color.BLACK &&
            this._Fetch_color(n.sibling!.right) === Color.BLACK)
        {
            n.sibling!.color = Color.RED;
            this._Erase_case1(n.parent!);
        }
        else
            this._Erase_case4(n);
    }

    private _Erase_case4(N: XTreeNode<Elem>): void
    {
        if (this._Fetch_color(N.parent) === Color.RED &&
            N.sibling !== null &&
            this._Fetch_color(N.sibling!) === Color.BLACK &&
            this._Fetch_color(N.sibling!.left) === Color.BLACK &&
            this._Fetch_color(N.sibling!.right) === Color.BLACK)
        {
            N.sibling!.color = Color.RED;
            N.parent!.color = Color.BLACK;
        }
        else
            this._Erase_case5(N);
    }

    private _Erase_case5(n: XTreeNode<Elem>): void
    {
        if (n === n.parent!.left &&
            n.sibling !== null &&
            this._Fetch_color(n.sibling!) === Color.BLACK &&
            this._Fetch_color(n.sibling!.left) === Color.RED &&
            this._Fetch_color(n.sibling!.right) === Color.BLACK)
        {
            n.sibling!.color = Color.RED;
            n.sibling!.left!.color = Color.BLACK;

            this._Rotate_right(n.sibling!);
        }
        else if (n === n.parent!.right &&
            n.sibling !== null &&
            this._Fetch_color(n.sibling!) === Color.BLACK &&
            this._Fetch_color(n.sibling!.left) === Color.BLACK &&
            this._Fetch_color(n.sibling!.right) === Color.RED)
        {
            n.sibling!.color = Color.RED;
            n.sibling!.right!.color = Color.BLACK;

            this._Rotate_left(n.sibling!);
        }
        this._Erase_case6(n);
    }
    
    private _Erase_case6(n: XTreeNode<Elem>): void
    {
        n.sibling!.color = this._Fetch_color(n.parent);
        n.parent!.color = Color.BLACK;

        if (n === n.parent!.left)
        {
            n.sibling!.right!.color = Color.BLACK;
            this._Rotate_left(n.parent!);
        }
        else
        {
            n.sibling!.left!.color = Color.BLACK;
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
    @inline()
    private _Fetch_color(node: XTreeNode<Elem> | null): Color
    {
        return (node !== null) 
            ? node.color 
            : Color.BLACK;
    }
}