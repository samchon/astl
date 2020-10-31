import { MapElementList } from "../internal/container/associative/MapElementList";
import { IteratorTree } from "../internal/tree/IteratorTree";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Comparator } from "../internal/functional/Comparator";
import { ErrorGenerator } from "../internal/exception/ErrorGenerator";

import { IPair } from "../utility/IPair";
import { Pair } from "../utility/Pair";
import { Entry } from "../utility/Entry";

export class TreeMultiMap<Key, T>
{
    private data_: MapElementList<Key, T, false, TreeMultiMap<Key, T>> = new MapElementList(<TreeMultiMap<Key, T>>this);
    private tree_: IteratorTree<Key, Entry<Key, T>, TreeMultiMap.Iterator<Key, T>, false>;

    public constructor(comp: Comparator<Key>)
    {
        this.tree_ = new IteratorTree
        (
            comp, 
            it => it.first, 
            false, 
            MapElementList.Iterator._Compare_uid
        );
    }

    public clear(): void
    {
        this.data_.clear();
        this.tree_.clear();
    }

    private key_eq(x: Key, y: Key): boolean
    {
        return !this.key_comp()(x, y) && !this.key_comp()(y, x);
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
        for (let it = this.find(key); it != this.end() && this.key_eq(key, it.first); it = it.next())
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
        return this.tree_.lower_bound(this.end(), key);
    }

    @inline()
    public upper_bound(key: Key): TreeMultiMap.Iterator<Key, T>
    {
        return this.tree_.upper_bound(this.end(), key);
    }

    @inline()
    public equal_range(key: Key): Pair<TreeMultiMap.Iterator<Key, T>, TreeMultiMap.Iterator<Key, T>>
    {
        return this.tree_.equal_range(this.end(), key);
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public emplace(key: Key, value: T): TreeMultiMap.Iterator<Key, T>
    {
        let it = this.upper_bound(key);

        it = this.data_.insert(it, new Entry(key, value));
        this.tree_.insert(it);

        return it;
    }

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
        const node = this.tree_.find(key);
        if (node == null)
            return 0;

        let count: usize = 0;
        for (let it = node.value; it != this.end() && this.key_eq(key, it.first); )
        {
            this.erase(it);
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