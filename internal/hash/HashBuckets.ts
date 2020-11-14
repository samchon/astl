import { Vector } from "../../container/Vector";

import { CMath } from "../numeric/CMath";
import { Hasher } from "../functional/Hasher";

export class HashBuckets<Key, Elem>
{
    private readonly hasher_: Hasher<Key>;
    protected readonly fetcher_: (elem: Elem) => Key;

    private max_load_factor_: f64;
    private data_: Vector<Vector<Elem>>;
    private size_: usize;

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    public constructor(hasher: Hasher<Key>, fetcher: (elem: Elem) => Key)
    {
        this.hasher_ = hasher;
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
            length = length / this.max_load_factor_;
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
    @inline()
    public length(): usize
    {
        return this.data_.size();
    }

    @inline()
    public capacity(): usize
    {
        return <usize>(this.length() * this.max_load_factor_);
    }

    @inline()
    public at(index: usize): Vector<Elem>
    {
        return this.data_.at(index);
    }

    @inline()
    public load_factor(): f64
    {
        return this.size_ / this.length();
    }

    @inline()
    public max_load_factor(): f64
    {
        return this.max_load_factor_;
    }

    @inline()
    public set_max_load_factor(z: f64): void
    {
        this.max_load_factor_ = z;
    }

    @inline()
    public hash_function(): Hasher<Key>
    {
        return this.hasher_;
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    @inline()
    private index(elem: Elem): usize
    {
        return this.hasher_(this.fetcher_(elem)) % this.length();
    }

    public insert(val: Elem): void
    {
        const capacity: usize = this.capacity();
        if (++this.size_ > capacity)
            this.rehash(capacity * 2);

        const index: usize = this.index(val);
        this.data_.at(index).push_back(val);
    }

    public erase(val: Elem): void
    {
        const index: usize = this.index(val);
        const bucket: Vector<Elem> = this.data_.at(index);

        for (let i: usize = 0; i < bucket.size(); ++i)
            if (bucket.at(i) === val)
            {
                bucket.erase(bucket.nth(i));
                --this.size_;
                break;
            }
    }
}

const MIN_BUCKET_COUNT: usize = 10;
const DEFAULT_MAX_FACTOR: f64 = 1.0;