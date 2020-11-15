import { MultiXTree } from "./MultiXTree";
import { XTreeNode } from "./XTreeNode";

import { IBidirectionalIterator } from "../../iterator/IBidirectionalIterator";
import { Pair } from "../../utility/Pair";

export class MultiIteratorTree<Key, IteratorT extends IBidirectionalIterator<any, IteratorT>>
    extends MultiXTree<Key, IteratorT>
{
    public lower_bound(end: IteratorT, key: Key): IteratorT
    {
        const node: XTreeNode<IteratorT> | null = this.nearest(key);
        if (node === null)
            return end;
        else if (this.key_comp()(this.key_getter()(node.value), key) === true)
            return node.value.next();
        else
            return node.value;
    }

    public upper_bound(end: IteratorT, key: Key): IteratorT
    {
        const node: XTreeNode<IteratorT> | null = this.nearest_with_mover(key, node => node.right);
        if (node === null)
            return end;

        const it: IteratorT = node.value;
        return this.key_comp()(key, this.key_getter()(it)) // key < it.value
            ? it
            : it.next();
    }

    public equal_range(end: IteratorT, key: Key): Pair<IteratorT, IteratorT>
    {
        const lower: IteratorT = this.lower_bound(end, key);
        const upper: IteratorT = (lower != end && this.key_comp()(key, this.key_getter()(lower)) === false)
            ? this.upper_bound(end, key)
            : lower;

        return new Pair(lower, upper);
    }
}