import { IContainer } from "../../../base/container/IContainer";
import { IForwardIterator } from "../../../iterator/IForwardIterator";
import { Pair } from "../../../utility/Pair";

export abstract class SetContainer<Key,
        Unique extends boolean,
        SourceT extends SetContainer<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
        ContainerT extends IContainer<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>,
        IteratorT extends SetContainer.Iterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
        ReverseT extends SetContainer.ReverseIterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
    implements IContainer<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>
{
    private data_: ContainerT;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    protected constructor(data: ContainerT)
    {
        this.data_ = data;
    }

    public assign<InputIterator extends IForwardIterator<Key, InputIterator>>
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
    public abstract insert(key: Key): SetContainer.InsertRet<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>;
    public abstract insert(hint: IteratorT, key: Key): IteratorT;
    public abstract insert<InputIterator extends IForwardIterator<Key, InputIterator>>
        (first: InputIterator, last: InputIterator): IteratorT;
    
    public abstract erase(key: Key): IteratorT;
    public abstract erase(it: IteratorT): IteratorT;
    public abstract erase(first: IteratorT, last: IteratorT): IteratorT;
}

export namespace SetContainer
{
    export type InsertRet<Key,
            Unique extends boolean,
            SourceT extends SetContainer<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ContainerT extends IContainer<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>, 
            IteratorT extends Iterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>, 
            ReverseT extends ReverseIterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        = Unique extends true 
            ? Pair<IteratorT, boolean> 
            : IteratorT;

    export interface Iterator<Key,
            Unique extends boolean,
            SourceT extends SetContainer<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
            ContainerT extends IContainer<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>,
            IteratorT extends Iterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
            ReverseT extends ReverseIterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        extends IContainer.Iterator<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>
    {
    }

    export interface ReverseIterator<Key,
            Unique extends boolean,
            SourceT extends SetContainer<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
            ContainerT extends IContainer<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>,
            IteratorT extends Iterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>,
            ReverseT extends ReverseIterator<Key, Unique, SourceT, ContainerT, IteratorT, ReverseT>>
        extends IContainer.ReverseIterator<Key, SourceT, ContainerT, IteratorT, ReverseT, Key>
    {
    }
}