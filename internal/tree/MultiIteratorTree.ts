import { XTree } from "./XTree";
import { XTreeNode } from "./XTreeNode";

import { IBidirectionalIterator } from "../../iterator/IBidirectionalIterator";
import { Comparator } from "../functional/Comparator";

export class MultiIteratorTree<Key, IteratorT extends IBidirectionalIterator<any, IteratorT>>
    extends XTree<Key, IteratorT>
{
    public constructor
        (
            fetcher: (it: IteratorT) => Key,
            keyComp: Comparator<Key>, 
            duplicateComp: (x: IteratorT, y: IteratorT) => boolean
        )
    {
        super(fetcher, keyComp, duplicateComp);
    }

    public upper_bound(end: IteratorT, key: Key): IteratorT
    {
        const node: XTreeNode<IteratorT> | null = this.nearest(key)
        if (node === null)
            return end;

        const it: IteratorT = node.value;
        return this.key_comp()(key, this.fetcher_(it)) // key < it.value
            ? it
            : it.next();
    }

    private nearest(key: Key): XTreeNode<IteratorT> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: XTreeNode<IteratorT> = this.root_!;
        let matched: XTreeNode<IteratorT> | null = null;

        while (true)
        {
            const candidate: IteratorT = ret.value;
            let node: XTreeNode<IteratorT> | null = null;

            // COMPARE
            if (this.key_comp()(key, this.fetcher_(candidate)) === true)
                node = ret.left;
            else if (this.key_comp()(this.fetcher_(candidate), key) === true)
                node = ret.right;
            else
            {
                matched = ret;
                node = ret.right;
            }

            // ULTIL CHILD NODE EXISTS
            if (node === null)
                break;
            ret = node;
        }

        // RETURNS -> MATCHED OR NOT
        if (matched !== null)
            return matched;
        else
            return ret;
    }
}