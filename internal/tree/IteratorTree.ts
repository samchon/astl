import { XTree } from "./XTree";
import { XTreeNode } from "./XTreeNode";

import { IBidirectionalIterator } from "../../iterator/IBidirectionalIterator";
import { Comparator } from "../functional/Comparator";
import { Pair } from "../../utility/Pair";

export class IteratorTree<Key, IteratorT extends IBidirectionalIterator<any, IteratorT>>
    extends XTree<Key, IteratorT>
{
    public constructor
        (
            fetcher: (it: IteratorT) => Key,
            keyComp: Comparator<Key>, 
            duplicateComp: ((x: IteratorT, y: IteratorT) => boolean) | null = null
        )
    {
        super(fetcher, keyComp, duplicateComp);
    }

    public lower_bound(end: IteratorT, key: Key): IteratorT
    {
        const node: XTreeNode<IteratorT> | null = this.nearest(key);
        if (node === null)
            return end;
        else if (this.key_comp()(this.fetcher_(node.value), key)) // it < key
            return node.value.next();
        else
            return node.value;
    }

    public upper_bound(end: IteratorT, key: Key): IteratorT
    {
        const node: XTreeNode<IteratorT> | null = (this.unique_ === true)
            ? this.nearest(key)
            : IteratorTree.multi_nearest<Key, IteratorT>(this, key, node => node.right);
        if (node === null)
            return end;

        const it: IteratorT = node.value;
        return this.key_comp()(key, this.fetcher_(it)) // key < it.value
            ? it
            : it.next();
    }

    @inline()
    public equal_range(end: IteratorT, key: Key): Pair<IteratorT, IteratorT>
    {
        return new Pair(this.lower_bound(end, key), this.upper_bound(end, key));
    }
}