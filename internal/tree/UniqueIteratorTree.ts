import { UniqueXTree } from "./UniqueXTree";
import { XTreeNode } from "./XTreeNode";

import { IBidirectionalIterator } from "../../iterator";
import { Pair } from "../../utility/Pair";

export class UniqueIteratorTree<Key, IteratorT extends IBidirectionalIterator<any, IteratorT>>
    extends UniqueXTree<Key, IteratorT>
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

    public upper_bound
        (
            end: IteratorT, 
            key: Key, 
            lower: IteratorT = this.lower_bound(end, key)
        ): IteratorT
    {
        if (lower != end && this.key_comp()(key, this.key_getter()(lower)) === false)
            return lower.next();
        else
            return lower;
    }

    public equal_range(end: IteratorT, key: Key): Pair<IteratorT, IteratorT>
    {
        const lower: IteratorT = this.lower_bound(end, key);
        const upper: IteratorT = this.upper_bound(end, key, lower);

        return new Pair(lower, upper);
    }
}