import { test_deque } from "./features/test_deque";
import { test_hash_map } from "./features/test_hash_map";
import { test_list } from "./features/test_list";
import { test_vector } from "./features/test_vector";

export function main(): void
{
    test_deque();
    test_vector();
    test_list();

    test_hash_map();
}