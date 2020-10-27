import { Vector } from "../../container/Vector";

import { CMath } from "../numeric/CMath";
import { Hasher } from "../functional/Hasher";

export class HashBuckets<Key, Elem>
{
    private hasher_: Hasher<Key>;
    private fetcher_: (elem: Elem) => Key;

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

        const data: Vector<Vector<Elem>> = new Vector();
        data.reserve(length);
        for (let i: usize = 0; i < length; ++i)
            data.push_back(new Vector());

        for (let i: usize = 0; i < this.data_.size(); ++i)
        {
            const row: Vector<Elem> = this.data_.at(i);
            for (let j: usize = 0; j < row.size(); ++j)
            {
                const element: Elem = row.at(i);
                const index: usize = this.hasher_(this.fetcher_(element)) % length;

                data.at(index).push_back(element);
            }
        }
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
    public length(): usize
    {
        return this.data_.size();
    }

    public capacity(): usize
    {
        return this.length() * this.max_load_factor_;
    }

    public at(index: usize): Vector<Elem>
    {
        return this.data_.at(index);
    }

    public load_factor(): f64
    {
        return this.size_ / this.length();
    }

    public max_load_factor(): f64;
    public max_load_factor(z: f64): void;
    public max_load_factor(z: number | null = null): f64 | void
    {
        if (z === null)
            return this.max_load_factor_;
        else
            this.max_load_factor_ = z;
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
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

        for (let i: number = 0; i < bucket.size(); ++i)
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