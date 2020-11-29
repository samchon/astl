import { Vector } from "../../container/Vector";

import { CMath } from "../numeric/CMath";
import { Hasher } from "../functional/Hasher";
import { BinaryPredicator } from "../functional/BinaryPredicator";

export class HashBuckets<Key, Elem>
{
    private readonly hasher_: Hasher<Key>;
    private readonly predicator_: BinaryPredicator<Key>;
    private readonly fetcher_: (elem: Elem) => Key;

    private max_load_factor_: f64;
    private data_: Vector<Vector<Elem>>;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key>, pred: BinaryPredicator<Key>, fetcher: (elem: Elem) => Key)
    {
        this.hasher_ = hasher;
        this.predicator_ = pred;
        this.fetcher_ = fetcher;

        this.max_load_factor_ = DEFAULT_MAX_FACTOR;
        this.data_ = new Vector();
        this.size_ = 0;

        this.initialize();
    }
    
    public clear(): void
    {
        this.data_.clear();
        this.size_ = 0;

        this.initialize();
    }

    public rehash(length: usize): void
    {
        length = CMath.max(length, MIN_BUCKET_COUNT);

        // CREATE NEW BUCKET
        const data: Vector<Vector<Elem>> = new Vector();
        data.reserve(length);

        for (let i: usize = 0; i < length; ++i)
            data.push_back(new Vector());

        // MIGRATE ELEMENTS TO THE NEW BUCKET
        for (let i: usize = 0; i < this.data_.size(); ++i)
        {
            const row: Vector<Elem> = this.data_.at(i);
            for (let j: usize = 0; j < row.size(); ++j)
            {
                const element: Elem = row.at(j);
                const index: usize = this.hasher_(this.fetcher_(element)) % length;
                
                data.at(index).push_back(element);
            }
        }

        // DO CHANGE THE BUCKET
        this.data_ = data;
    }

    public reserve(length: usize): void
    {
        if (length > this.capacity())
        {
            length = <usize>(length / this.max_load_factor_);
            this.rehash(length);
        }
    }

    private initialize(): void
    {
        for (let i: usize = 0; i < MIN_BUCKET_COUNT; ++i)
            this.data_.push_back(new Vector());
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    @inline
    public size(): usize
    {
        return this.size_;
    }

    @inline
    public row_size(): usize
    {
        return this.data_.size();
    }

    @inline
    public capacity(): usize
    {
        return <usize>(this.row_size() * this.max_load_factor_);
    }

    @inline
    public at(index: usize): Vector<Elem>
    {
        return this.data_.at(index);
    }

    @inline
    public load_factor(): f64
    {
        return this.size_ / this.row_size();
    }

    @inline
    public max_load_factor(): f64
    {
        return this.max_load_factor_;
    }

    @inline
    public set_max_load_factor(z: f64): void
    {
        this.max_load_factor_ = z;
    }

    @inline
    public hash_function(): Hasher<Key>
    {
        return this.hasher_;
    }

    @inline
    public key_eq(): BinaryPredicator<Key>
    {
        return this.predicator_;
    }

    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    @inline
    private index(elem: Elem): usize
    {
        return this.hasher_(this.fetcher_(elem)) % this.row_size();
    }

    public find(key: Key): Elem | null
    {
        const index: usize = this.hash_function()(key) % this.row_size();
        const bucket: Vector<Elem> = this.at(index);

        for (let i: usize = 0; i < bucket.size(); ++i)
        {
            const it: Elem = bucket.at(i);
            if (this.predicator_(key, this.fetcher_(it)) === true)
                return it;
        }
        return null;
    }
    
    public count(key: Key): usize
    {
        const index: usize = this.hash_function()(key) % this.row_size();
        const bucket: Vector<Elem> = this.at(index);

        let ret: usize = 0;
        for (let i: usize = 0; i < bucket.size(); ++i)
            if (this.key_eq()(key, this.fetcher_(bucket.at(i))) === true)
                ++ret;

        return ret;
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    public insert(val: Elem): void
    {
        const capacity: usize = this.capacity();
        if (++this.size_ > capacity)
            this.rehash(capacity * 2);

        const index: usize = this.index(val);
        const bucket: Vector<Elem> = this.data_.at(index);

        bucket.push_back(val);
    }

    public erase(val: Elem): boolean
    {
        const index: usize = this.index(val);
        const bucket: Vector<Elem> = this.data_.at(index);

        for (let i: usize = 0; i < bucket.size(); ++i)
            if (bucket.at(i) === val)
            {
                bucket.erase(bucket.nth(i));
                --this.size_;

                return true;
            }
        return false;
    }
}

const MIN_BUCKET_COUNT: usize = 10;
const DEFAULT_MAX_FACTOR: f64 = 1.0;