import { MapElementList } from "../internal/container/associative/MapElementList";
import { IteratorTree } from "../internal/tree/IteratorTree";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { IPair } from "../utility/IPair";
import { Pair } from "../utility/Pair";
import { Entry } from "../utility/Entry";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";

import { Comparator } from "../internal/functional/Comparator";
import { less } from "../functional/comparators";

export class TreeMap<Key, T>
{
    private data_: MapElementList<Key, T, true, TreeMap<Key, T>> = new MapElementList(<TreeMap<Key, T>>this);
    private tree_: IteratorTree<Key, TreeMap.Iterator<Key, T>>;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(comp: Comparator<Key> = (x, y) => less(x, y))
    {
        this.tree_ = new IteratorTree(it => it.first, comp);
    }

    @inline()
    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
    }

    public swap(obj: TreeMap<Key, T>): void
    {
        // SWAP ELEMENTS
        this.data_.swap(obj.data_);
        
        const data: MapElementList<Key, T, true, TreeMap<Key, T>> = this.data_;
        this.data_ = obj.data_;
        obj.data_ = data;

        // SWAP TREE
        const tree: IteratorTree<Key, TreeMap.Iterator<Key, T>> = this.tree_;
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
    public begin(): TreeMap.Iterator<Key, T>
    {
        return this.data_.begin();
    }

    @inline()
    public end(): TreeMap.Iterator<Key, T>
    {
        return this.data_.end();
    }

    @inline()
    public rbegin(): TreeMap.ReverseIterator<Key, T>
    {
        return this.data_.rbegin();
    }

    @inline()
    public rend(): TreeMap.ReverseIterator<Key, T>
    {
        return this.data_.rend();
    }

    @inline()
    public find(key: Key): TreeMap.Iterator<Key, T>
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
    @operator("[]")
    public get(key: Key): T
    {
        const node = this.tree_.find(key);
        if (node === null)
            throw ErrorGenerator.key_nout_found("TreeMap.get()", key);
        return node.value.second;
    }

    @inline()
    public key_comp(): Comparator<Key>
    {
        return this.tree_.key_comp();
    }

    @inline()
    public lower_bound(key: Key): TreeMap.Iterator<Key, T>
    {
        return this.tree_.lower_bound(this.end(), key);
    }

    @inline()
    public upper_bound(key: Key): TreeMap.Iterator<Key, T>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline()
    public equal_range(key: Key): Pair<TreeMap.Iterator<Key, T>, TreeMap.Iterator<Key, T>>
    {
        return this.tree_.equal_range(this.end(), key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline()
    @operator("[]=")
    public set(key: Key, value: T): void
    {
        const tuple: Pair<TreeMap.Iterator<Key, T>, boolean> = this.emplace(key, value);
        if (tuple.second === false)
            tuple.first.second = value;
    }

    public emplace(key: Key, value: T): Pair<TreeMap.Iterator<Key, T>, boolean>
    {
        const lower: TreeMap.Iterator<Key, T> = this.lower_bound(key);
        if (lower != this.end() && this.key_comp()(key, lower.first) === false)
            return new Pair(lower, false);

        const entry: Entry<Key, T> = new Entry(key, value);
        const it: TreeMap.Iterator<Key, T> = this.data_.insert(lower, entry);
        this.tree_.insert(it);

        return new Pair(it, true);
    }

    public emplace_hint(hint: TreeMap.Iterator<Key, T>, key: Key, value: T): TreeMap.Iterator<Key, T>
    {
        return this.emplace(key, value).first;
    }

    public insert_range<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        for (; first != last; first = first.next())
            this.emplace(first.value.first, first.value.second);
    }

    public erase(first: TreeMap.Iterator<Key, T>, last: TreeMap.Iterator<Key, T> = first.next()): TreeMap.Iterator<Key, T>
    {
        const it: TreeMap.Iterator<Key, T> = this.data_.erase(first, last);
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

export namespace TreeMap
{
    export type Iterator<Key, T> = MapElementList.Iterator<Key, T, true, TreeMap<Key, T>>;
    export type ReverseIterator<Key, T> = MapElementList.ReverseIterator<Key, T, true, TreeMap<Key, T>>;
}