import { test_deque } from "./features/containers/test_deque";
import { test_list } from "./features/containers/test_list";
import { test_vector } from "./features/containers/test_vector";

export function main(): void
{
    test_vector();
    // test_deque();
    test_list();
}