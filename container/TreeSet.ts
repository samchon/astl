import { SetElementList } from "../internal/container/associative/SetElementList";
import { IteratorTree } from "../internal/tree/IteratorTree";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Comparator } from "../internal/functional/Comparator";
import { Pair } from "../utility/Pair";

export class TreeSet<Key>
{
    private data_: SetElementList<Key, true, TreeSet<Key>> = new SetElementList(<TreeSet<Key>>this);
    private tree_: IteratorTree<Key, TreeSet.Iterator<Key>, true>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key>)
    {
        this.tree_ = new IteratorTree(comp, it => it.value, true);
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
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
    public begin(): TreeSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): TreeSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): TreeSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): TreeSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): TreeSet.Iterator<Key>
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
        return this.has(key) ? 1 : 0;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.tree_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): TreeSet.Iterator<Key>
    {
        return this.tree_.lower_bound(this.end(), key);
    }

    @inline()
    public upper_bound(key: Key): TreeSet.Iterator<Key>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline()
    public equal_range(key: Key): Pair<TreeSet.Iterator<Key>, TreeSet.Iterator<Key>>
    {
        return this.tree_.equal_range(this.end(), key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): Pair<TreeSet.Iterator<Key>, boolean>
    {
        let it: TreeSet.Iterator<Key> = this.lower_bound(key);
        if (it != this.end() && this.key_comp()(it.value, key) === true)
            return new Pair(it, false);

        it = this.data_.insert(it, key);
        this.tree_.insert(it);

        return new Pair(it, true);
    }

    public insert_hint(hint: TreeSet.Iterator<Key>, key: Key): TreeSet.Iterator<Key>
    {
        return this.insert(key).first;
    }

    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }

    public erase(first: TreeSet.Iterator<Key>, last: TreeSet.Iterator<Key> = first.next()): TreeSet.Iterator<Key>
    {
        const it: TreeSet.Iterator<Key> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.tree_.erase(first);

        return it;
    }

    public erase_by_key(key: Key): usize
    {
        const node = this.tree_.find(key);
        if (node == null)
            return 0;

        this.data_.erase(node.value);
        this.tree_.erase(node.value);
        return 1;
    }
}

export namespace TreeSet
{
    export type Iterator<Key> = SetElementList.Iterator<Key, true, TreeSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, true, TreeSet<Key>>;
}