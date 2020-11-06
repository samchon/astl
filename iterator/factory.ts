import { IPushBack } from "../internal/container/partial/IPushBack";
import { BackInsertIterator } from "./BackInsertIterator";

export function back_inserter<Source extends IPushBack<T>, T>
    (source: Source): BackInsertIterator<Source, T>
{
    return new BackInsertIterator(source);
}