import { SetElementList } from "../internal/container/associative/SetElementList";
import { IteratorTree } from "../internal/tree/IteratorTree";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Pair } from "../utility/Pair";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";

export class TreeMultiSet<Key>
{
    private data_: SetElementList<Key, false, TreeMultiSet<Key>> = new SetElementList(<TreeMultiSet<Key>>this);
    private tree_: IteratorTree<Key, TreeMultiSet.Iterator<Key>>;

    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.tree_ = new IteratorTree
        (
            it => it.value, 
            comp, 
            (x, y) => SetElementList.Iterator._Compare_uid<Key, false, TreeMultiSet<Key>>(x, y)
        );
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
    }

    public swap(obj: TreeMultiSet<Key>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: SetElementList<Key, true, TreeMultiSet<Key>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP TREE
        const tree: IteratorTree<Key, TreeMultiSet.Iterator<Key>> = this.tree_;
        this.tree_ = obj.tree_;
        obj.tree_ = tree;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline()
    public size(): usize
    {
        return this.data_.size();
    }

    @inline()
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline()
    public begin(): TreeMultiSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): TreeMultiSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): TreeMultiSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): TreeMultiSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): TreeMultiSet.Iterator<Key>
    {
        const node = this.tree_.find(key);
        return (node !== null) ? node.value : this.end();
    }

    @inline()
    public has(key: Key): boolean
    {
        return this.tree_.find(key) !== null;
    }

    @inline()
    public count(key: Key): usize
    {
        let ret: usize = 0;
        for (let it = this.find(key); it != this.end() && this.key_comp()(key, it.value) === false; it = it.next())
            ++ret;
        return ret;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.tree_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): TreeMultiSet.Iterator<Key>
    {
        return this.tree_.lower_bound(this.end(), key);
    }

    @inline()
    public upper_bound(key: Key): TreeMultiSet.Iterator<Key>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline()
    public equal_range(key: Key): Pair<TreeMultiSet.Iterator<Key>, TreeMultiSet.Iterator<Key>>
    {
        return this.tree_.equal_range(this.end(), key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): TreeMultiSet.Iterator<Key>
    {
        const upper: TreeMultiSet.Iterator<Key> = this.upper_bound(key);
        const it: TreeMultiSet.Iterator<Key> = this.data_.insert(upper, key);

        this.tree_.insert(it);
        return it;
    }

    @inline()
    public insert_hint(hint: TreeMultiSet.Iterator<Key>, key: Key): TreeMultiSet.Iterator<Key>
    {
        return this.insert(key);
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }
    
    public erase(first: TreeMultiSet.Iterator<Key>, last: TreeMultiSet.Iterator<Key> = first.next()): TreeMultiSet.Iterator<Key>
    {
        const ret = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.tree_.erase(first);

        return ret;
    }

    public erase_by_key(key: Key): usize
    {
        const node = this.tree_.find(key);
        if (node == null)
            return 0;

        let count: usize = 0;
        for (let it = node.value; it != this.end() && this.key_comp()(key, it.value) === false; )
        {
            it = this.erase(it);
            ++count;
        }
        return count;
    }
}

export namespace TreeMultiSet
{
    export type Iterator<Key> = SetElementList.Iterator<Key, false, TreeMultiSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, false, TreeMultiSet<Key>>;
}