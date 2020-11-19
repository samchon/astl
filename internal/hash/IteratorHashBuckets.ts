import { HashBuckets } from "./HashBuckets";

import { IBidirectionalIterator } from "../../iterator/IBidirectionalIterator";
import { Hasher } from "../functional/Hasher";
import { BinaryPredicator } from "../functional/BinaryPredicator";

import { Vector } from "../../container/Vector";

export class IteratorHashBuckets<Key, IteratorT extends IBidirectionalIterator<any, IteratorT>>
    extends HashBuckets<Key, IteratorT>
{
    private readonly key_eq_: BinaryPredicator<Key>;

    public constructor(hasher: Hasher<Key>, predicator: BinaryPredicator<Key>, fetcher: (elem: IteratorT) => Key)
    {
        super(hasher, fetcher);
        this.key_eq_ = predicator;
    }

    @inline
    public key_eq(): BinaryPredicator<Key>
    {
        return this.key_eq_;
    }

    public find(key: Key): IteratorT | null
    {
        const index: usize = this.hash_function()(key) % this.length();
        const bucket: Vector<IteratorT> = this.at(index);

        for (let i: usize = 0; i < bucket.size(); ++i)
        {
            const it: IteratorT = bucket.at(i);
            if (this.key_eq_(key, this.fetcher_(it)) === true)
                return it;
        }
        return null;
    }
}