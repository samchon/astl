import { IContainer } from "../../../base/container/IContainer";

import { IPair } from "../../../utility/IPair";
import { Pair } from "../../../utility/Pair";
import { Entry } from "../../../utility/Entry";
import { IForwardIterator } from "../../../iterator/IForwardIterator";

export abstract class MapContainer<Key, T, 
        Unique extends boolean, 
        SourceT extends MapContainer<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
        ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>,
        IteratorT extends MapContainer.Iterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
        ReverseT extends MapContainer.ReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
    implements IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>
{
    protected data_: ContainerT;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    protected constructor(data: ContainerT)
    {
        this.data_ = data;
    }

    public assign<InputIterator extends IForwardIterator<IPair<Key, T>, InputIterator>>
        (first: InputIterator, last: InputIterator): void
    {
        this.clear();
        this.insert(first, last);
    }

    public clear(): void
    {
        this.data_.clear();
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    public size(): usize
    {
        return this.data_.size();
    }

    public empty(): boolean
    {
        return this.data_.empty();
    }

    public begin(): IteratorT
    {
        return this.data_.begin();
    }

    public end(): IteratorT
    {
        return this.data_.end();
    }

    public rbegin(): ReverseT
    {
        return this.data_.rbegin();
    }

    public rend(): ReverseT
    {
        return this.data_.rend();
    }

    public abstract find(key: Key): IteratorT;
    public abstract count(key: Key): usize;

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public abstract emplace(key: Key, value: T): MapContainer.InsertRet<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>;
    public abstract emplace_hint(hint: IteratorT, key: Key, value: T): IteratorT;
    public abstract insert<Inputiterator extends IForwardIterator<IPair<Key, T>, Inputiterator>>
        (first: Inputiterator, last: Inputiterator): IteratorT;

    public abstract erase(key: Key): IteratorT;
    public abstract erase(it: IteratorT): IteratorT;
    public abstract erase(first: IteratorT, last: IteratorT): IteratorT;
}

export namespace MapContainer
{
    export type InsertRet<Key, T, 
            Unique extends boolean,
            SourceT extends MapContainer<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
            IteratorT extends Iterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ReverseT extends ReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        = Unique extends true 
            ? Pair<IteratorT, boolean> 
            : IteratorT;

    export interface Iterator<Key, T, 
            Unique extends boolean,
            SourceT extends MapContainer<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
            IteratorT extends Iterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ReverseT extends ReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        extends IContainer.Iterator<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>
    {
        readonly first: Key;
        second: T;
    }

    export interface ReverseIterator<Key, T, 
            Unique extends boolean,
            SourceT extends MapContainer<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ContainerT extends IContainer<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>, 
            IteratorT extends Iterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ReverseT extends ReverseIterator<Key, T, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        extends IContainer.ReverseIterator<Entry<Key, T>, SourceT, ContainerT, IteratorT, ReverseT, IPair<Key, T>>
    {
        readonly first: Key;
        second: T;
    }
}