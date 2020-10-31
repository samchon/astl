import { HashMap } from "../../container/HashMap";

export function test_hash_map(): void
{
    const dict: HashMap<string, i32> = new HashMap(() => 0, () => true);
    dict.emplace("first", 1);
}