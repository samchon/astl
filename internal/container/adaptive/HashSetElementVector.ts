import { Vector } from "../../../container/Vector";
import { Pair } from "../../../utility";
import { HashBuckets } from "../../hash/HashBuckets";
import { ReverseIteratorBase } from "../../iterator/ReverseIteratorBase";
import { IHashSet } from "../associative/IHashSet";

export namespace HashSetElementVector
{
    interface ISource<Key, 
            Unique extends boolean, 
            SourceT extends ISource<Key, Unique, SourceT>>
        extends IHashSet<Key, 
            Unique, 
            SourceT, 
            Iterator<Key, Unique, SourceT>,
            ReverseIterator<Key, Unique, SourceT>>
    {
        get_buckets(): HashBuckets<Key, Key>;
    }

    export class Iterator<Key,
            Unique extends boolean,
            SourceT extends ISource<Key, Unique, SourceT>>
    {
        private source_: SourceT;
        private indexes_: Pair<usize, usize>;

        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        public constructor(source: SourceT, indexes: Pair<usize, usize>)
        {
            this.source_ = source;
            this.indexes_ = indexes;
        }

        @inline
        public reverse(): ReverseIterator<Key, Unique, SourceT>
        {
            return new ReverseIterator(this);
        }

        @inline
        public prev(): Iterator<Key, Unique, SourceT>
        {
            const bucketList: HashBuckets<Key, Key> = this.source_.get_buckets();
            const row: isize = <isize>this.indexes_.first;

            if (row >= bucketList.size())
                return this.source_.end();

            for (let i: isize = row; i >= 0; --i)
            {
                const bucket: Vector<Key> = bucketList.at(i);
                let j: isize = (row === i) ? this.indexes_.second - 1 : bucket.size() - 1;

                for (; j >= 0; --j)
                    return new Iterator(this.source_, new Pair(i, j));
            }
            return this.source_.end();
        }

        @inline
        public next(): Iterator<Key, Unique, SourceT>
        {
            const bucketList: HashBuckets<Key, Key> = this.source_.get_buckets();
            const row: usize = this.indexes_.first;

            for (let i: usize = row; i < bucketList.count(); ++i)
            {
                const bucket: Vector<Key> = bucketList.at(i);
                let j: usize = (row === i) ? this.indexes_.second + 1 : 0;

                for (; j < bucket.size(); ++j)
                    return new Iterator(this.source_, new Pair(i, j));
            }
            return this.source_.end();
        }

        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        @inline
        public source(): SourceT
        {
            return this.source_;
        }

        @inline
        public indexes(): Pair<usize, usize>
        {
            return this.indexes_;
        }

        @inline()
        public get value(): Key
        {
            return this.source_.get_buckets()
                .at(this.indexes_.first)
                .at(this.indexes_.second);
        }

        /* ---------------------------------------------------------
            OPERATORS
        --------------------------------------------------------- */
        @inline
        public equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return this.source_ === obj.source_ && this.indexes_ == obj.indexes_;
        }

        @inline
        @operator("!=")
        protected __not_equals(obj: Iterator<Key, Unique, SourceT>): boolean
        {
            return !this.equals(obj);
        }
    }

    export class ReverseIterator<Key,
            Unique extends boolean,
            SourceT extends ISource<Key, Unique, SourceT>>
        extends ReverseIteratorBase<Key, 
            SourceT, 
            Iterator<Key, Unique, SourceT>, 
            ReverseIterator<Key, Unique, SourceT>, 
            Key>
    {
        @inline
        public get value(): Key
        {
            return this.base_.value;
        }
    }
}