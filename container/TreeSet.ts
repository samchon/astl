import { SetElementList } from "../internal/container/associative/SetElementList";
import { UniqueIteratorTree } from "../internal/tree/UniqueIteratorTree";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Pair } from "../utility/Pair";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";

export class TreeSet<Key>
{
    private data_: SetElementList<Key, true, TreeSet<Key>> = new SetElementList(<TreeSet<Key>>this);
    private tree_: UniqueIteratorTree<Key, TreeSet.Iterator<Key>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.tree_ = new UniqueIteratorTree<Key, TreeSet.Iterator<Key>>(it => it.value, comp);
    }

    @inline
    public assign<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(first, last);
    }

    @inline
    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
    }

    public swap(obj: TreeSet<Key>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: SetElementList<Key, true, TreeSet<Key>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP TREE
        const tree: UniqueIteratorTree<Key, TreeSet.Iterator<Key>> = this.tree_;
        this.tree_ = obj.tree_;
        obj.tree_ = tree;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public size(): usize
    {
        return this.data_.size();
    }

    @inline
    public empty(): boolean
    {
        return this.data_.empty();
    }

    @inline
    public begin(): TreeSet.Iterator<Key>
    {
        return this.data_.begin();
    }

    @inline
    public end(): TreeSet.Iterator<Key>
    {
        return this.data_.end();
    }

    @inline
    public rbegin(): TreeSet.ReverseIterator<Key>
    {
        return this.data_.rbegin();
    }

    @inline
    public rend(): TreeSet.ReverseIterator<Key>
    {
        return this.data_.rend();
    }

    @inline
    public find(key: Key): TreeSet.Iterator<Key>
    {
        const it: TreeSet.Iterator<Key> = this.lower_bound(key);
        return (it != this.end() && this.key_comp()(key, it.value) === false)
            ? it
            : this.end();
    }

    @inline
    public has(key: Key): boolean
    {
        return this.find(key) != this.end();
    }

    @inline
    public count(key: Key): usize
    {
        return this.has(key) ? 1 : 0;
    }

    @inline
    public key_comp(): Comparator<Key>
    {
        return this.tree_.key_comp();
    }

    @inline
    public lower_bound(key: Key): TreeSet.Iterator<Key>
    {
        return this.tree_.lower_bound(this.end(), key);
    }

    @inline
    public upper_bound(key: Key): TreeSet.Iterator<Key>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline
    public equal_range(key: Key): Pair<TreeSet.Iterator<Key>, TreeSet.Iterator<Key>>
    {
        return this.tree_.equal_range(this.end(), key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(key: Key): Pair<TreeSet.Iterator<Key>, boolean>
    {
        const lower: TreeSet.Iterator<Key> = this.lower_bound(key);
        if (lower != this.end() && this.key_comp()(key, lower.value) === false)
            return new Pair(lower, false);

        const it: TreeSet.Iterator<Key> = this.data_.insert(lower, key);
        this.tree_.insert(it);

        return new Pair(it, true);
    }

    @inline
    public insert_hint(hint: TreeSet.Iterator<Key>, key: Key): TreeSet.Iterator<Key>
    {
        return this.insert(key).first;
    }

    @inline
    public insert_range<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.insert(first.value);
    }

    @inline
    public erase(first: TreeSet.Iterator<Key>, last: TreeSet.Iterator<Key> = first.next()): TreeSet.Iterator<Key>
    {
        const it: TreeSet.Iterator<Key> = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.tree_.erase(first);

        return it;
    }

    @inline
    public erase_by_key(key: Key): usize
    {
        const it: TreeSet.Iterator<Key> = this.find(key);
        if (it == this.end())
            return 0;

        this.data_.erase(it);
        this.tree_.erase(it);
        return 1;
    }
}

export namespace TreeSet
{
    export type Iterator<Key> = SetElementList.Iterator<Key, true, TreeSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, true, TreeSet<Key>>;
}