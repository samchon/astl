import { MapContainer } from "../associative/MapContainer";
import { ListContainer } from "./ListContainer";

import { ListIterator } from "../../iterator/ListIterator";
import { ListReverseIterator } from "../../iterator/ListReverseIterator";

import { IPair } from "../../../utility/IPair";
import { Entry } from "../../../utility/Entry";

export class MapElementList<Key, T, 
        Unique extends boolean, 
        Source extends MapContainer<Key, T, 
            Unique, 
            Source, 
            MapElementList<Key, T, Unique, Source>, 
            MapElementList.Iterator<Key, T, Unique, Source>, 
            MapElementList.ReverseIterator<Key, T, Unique, Source>>>
    extends ListContainer<Entry<Key, T>, 
        Source,
        MapElementList<Key, T, Unique, Source>,
        MapElementList.Iterator<Key, T, Unique, Source>,
        MapElementList.ReverseIterator<Key, T, Unique, Source>,
        IPair<Key, T>>
{
    private source_ptr_: SourcePtr<Source>;

    public constructor(source: Source)
    {
        super();
        this.source_ptr_ = new SourcePtr(source);
    }

    protected _Create_iterator(prev?: MapElementList.Iterator<Key, T, Unique, Source>, next?: MapElementList.Iterator<Key, T, Unique, Source>, value?: Entry<Key, T>): MapElementList.Iterator<Key, T, Unique, Source>
    {
        return new MapElementList.Iterator(this.source_ptr_, prev, next, value);
    }
}

export namespace MapElementList
{
    export class Iterator<Key, T, 
            Unique extends boolean, 
            Source extends MapContainer<Key, T, 
                Unique, 
                Source, 
                MapElementList<Key, T, Unique, Source>, 
                MapElementList.Iterator<Key, T, Unique, Source>, 
                MapElementList.ReverseIterator<Key, T, Unique, Source>>>
        extends ListIterator<Entry<Key, T>, 
            Source,
            MapElementList<Key, T, Unique, Source>,
            MapElementList.Iterator<Key, T, Unique, Source>,
            MapElementList.ReverseIterator<Key, T, Unique, Source>,
            IPair<Key, T>>
    {
        private source_ptr_: SourcePtr<Source>;

        public constructor
            (
                sourcePtr: SourcePtr<Source>, 
                prev?: Iterator<Key, T, Unique, Source>, 
                next?: Iterator<Key, T, Unique, Source>, 
                value?: Entry<Key, T>
            )
        {
            super(prev, next, value);
            this.source_ptr_ = sourcePtr;
        }
        
        public source(): Source
        {
            return this.source_ptr_.value;
        }

        public reverse(): ReverseIterator<Key, T, Unique, Source>
        {
            return new ReverseIterator(this);
        }

        public get value(): Entry<Key, T>
        {
            return this.value_!;
        }

        public get first(): Key
        {
            return this.value.first;
        }

        public get second(): T
        {
            return this.value.second;
        }

        public set second(val: T)
        {
            this.second = val;
        }
    }

    export class ReverseIterator<Key, T, 
            Unique extends boolean, 
            Source extends MapContainer<Key, T, 
                Unique, 
                Source, 
                MapElementList<Key, T, Unique, Source>, 
                MapElementList.Iterator<Key, T, Unique, Source>, 
                MapElementList.ReverseIterator<Key, T, Unique, Source>>>
        extends ListReverseIterator<Entry<Key, T>, 
            Source,
            MapElementList<Key, T, Unique, Source>,
            MapElementList.Iterator<Key, T, Unique, Source>,
            MapElementList.ReverseIterator<Key, T, Unique, Source>,
            IPair<Key, T>>
    {
        protected _Create_neighbor(base: Iterator<Key, T, Unique, Source>): ReverseIterator<Key, T, Unique, Source>
        {
            return new ReverseIterator(base);
        }

        public get value(): Entry<Key, T>
        {
            return this.base().value;
        }

        public get first(): Key
        {
            return this.value.first;
        }

        public get second(): T
        {
            return this.value.second;
        }

        public set second(val: T)
        {
            this.second = val;
        }
    }
}

class SourcePtr<Source>
{
    public value: Source;

    public constructor(value: Source)
    {
        this.value = value;
    }
}