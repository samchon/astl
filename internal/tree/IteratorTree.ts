import { XTree } from "./XTree";
import { XTreeNode } from "./XTreeNode";

import { IBidirectionalIterator } from "../../iterator/IBidirectionalIterator";
import { Comparator } from "../functional/Comparator";
import { Pair } from "../../utility/Pair";

export class IteratorTree<Key, 
        IteratorT extends IBidirectionalIterator<any, IteratorT>,
        Unique extends boolean>
    extends XTree<Key, IteratorT, Unique>
{
    public constructor
        (
            keyComp: Comparator<Key>, 
            fetcher: (it: IteratorT) => Key, 
            unique: Unique,
            duplicateComp: ((x: IteratorT, y: IteratorT) => boolean) | null = null
        )
    {
        super(keyComp, fetcher, unique, duplicateComp);
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
        const node: XTreeNode<IteratorT> | null = this.unique_ === true
            ? this.nearest(key)
            : IteratorTree.multi_nearest(this, key, node => node.right);
        if (node === null)
            return end;

        const it: IteratorT = node.value;
        return this.key_comp()(key, this.fetcher_(it))
            ? it
            : it.next();
    }

    @inline()
    public equal_range(end: IteratorT, key: Key): Pair<IteratorT, IteratorT>
    {
        return new Pair(this.lower_bound(end, key), this.upper_bound(end, key));
    }
}