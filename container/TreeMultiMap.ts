import { MapElementList } from "../internal/container/associative/MapElementList";
import { MultiIteratorTree } from "../internal/tree/MultiIteratorTree";
import { XTreeNode } from "../internal/tree/XTreeNode";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { IPair } from "../utility/IPair";
import { Pair } from "../utility/Pair";
import { Entry } from "../utility/Entry";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";

export class TreeMultiMap<Key, T>
{
    private data_: MapElementList<Key, T, false, TreeMultiMap<Key, T>> = new MapElementList(<TreeMultiMap<Key, T>>this);
    private tree_: MultiIteratorTree<Key, TreeMultiMap.Iterator<Key, T>>;

    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.tree_ = new MultiIteratorTree
        (
            it => it.first, 
            comp,
            (x, y) => MapElementList.Iterator._Compare_uid<Key, T, false, TreeMultiMap<Key, T>>(x, y)
        );
    }

    @inline()
    public assign<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        if (this.empty() === false)
            this.clear();
        this.insert_range<InputIterator>(first, last);
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
    }

    public swap(obj: TreeMultiMap<Key, T>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: MapElementList<Key, T, true, TreeMultiMap<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP TREE
        const tree: MultiIteratorTree<Key, TreeMultiMap.Iterator<Key, T>> = this.tree_;
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
    public begin(): TreeMultiMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): TreeMultiMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): TreeMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): TreeMultiMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): TreeMultiMap.Iterator<Key, T>
    {
        const node: XTreeNode<TreeMultiMap.Iterator<Key, T>> | null = this.tree_.lower_bound(key);
        return (node !== null && this.key_comp()(key, node.value.first) === false)
            ? node.value
            : this.end();
    }

    @inline()
    public has(key: Key): boolean
    {
        return this.find(key) != this.end();
    }

    @inline()
    public count(key: Key): usize
    {
        let ret: usize = 0;
        for (let it = this.find(key); it != this.end() && this.key_comp()(key, it.first) === false; it = it.next())
            ++ret;
        return ret;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.tree_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): TreeMultiMap.Iterator<Key, T>
    {
        const node: XTreeNode<TreeMultiMap.Iterator<Key, T>> | null = this.tree_.lower_bound(key);
        return (node !== null) 
            ? node.value 
            : this.end();
    }

    @inline()
    public upper_bound(key: Key): TreeMultiMap.Iterator<Key, T>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline()
    public equal_range(key: Key): Pair<TreeMultiMap.Iterator<Key, T>, TreeMultiMap.Iterator<Key, T>>
    {
        const lower: TreeMultiMap.Iterator<Key, T> = this.lower_bound(key);
        const upper: TreeMultiMap.Iterator<Key, T> = (lower != this.end() && this.key_comp()(key, lower.first) === false)
            ? this.upper_bound(key)
            : lower;
        return new Pair(lower, upper);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public emplace(key: Key, value: T): TreeMultiMap.Iterator<Key, T>
    {
        const upper: TreeMultiMap.Iterator<Key, T> = this.upper_bound(key);
        const it: TreeMultiMap.Iterator<Key, T> = this.data_.insert(upper, new Entry(key, value));

        this.tree_.insert(it);
        return it;
    }

    @inline()
    public emplace_hint(hint: TreeMultiMap.Iterator<Key, T>, key: Key, value: T): TreeMultiMap.Iterator<Key, T>
    {
        return this.emplace(key, value);
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.emplace(first.value.first, first.value.second);
    }
    
    public erase(first: TreeMultiMap.Iterator<Key, T>, last: TreeMultiMap.Iterator<Key, T> = first.next()): TreeMultiMap.Iterator<Key, T>
    {
        const ret = this.data_.erase(first, last);
        for (; first != last; first = first.next())
            this.tree_.erase(first);

        return ret;
    }

    public erase_by_key(key: Key): usize
    {
        let it: TreeMultiMap.Iterator<Key, T> = this.find(key);
        if (it == this.end())
            return 0;

        let count: usize = 0;
        while (it != this.end() && this.key_comp()(key, it.first) === false)
        {
            it = this.erase(it);
            ++count;
        }
        return count;
    }
}

export namespace TreeMultiMap
{
    export type Iterator<Key, T> = MapElementList.Iterator<Key, T, false, TreeMultiMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementList.ReverseIterator<Key, T, false, TreeMultiMap<Key, T>>;
}