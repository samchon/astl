//----
// CONTAINERS
//----
import { test_vector } from "./features/containers/test_vector";
import { test_deque } from "./features/containers/test_deque";
import { test_list } from "./features/containers/test_list";
// import { test_forward_list } from "./features/containers/test_forward_list";

import { test_tree_map } from "./features/containers/test_tree_map";
import { test_tree_multi_map } from "./features/containers/test_tree_multi_map";
import { test_tree_multi_set } from "./features/containers/test_tree_multi_set";
import { test_tree_set } from "./features/containers/test_tree_set";

import { test_hash_map } from "./features/containers/test_hash_map";
import { test_hash_multi_map } from "./features/containers/test_hash_multi_map";
import { test_hash_multi_set } from "./features/containers/test_hash_multi_set";
import { test_hash_set } from "./features/containers/test_hash_set";

import { test_priority_queue } from "./features/containers/test_priority_queue";
import { test_queue } from "./features/containers/test_queue";
import { test_stack } from "./features/containers/test_stack";
import { test_storing_objects } from "./features/containers/test_storing_objects";

import { test_hash } from "./features/functional/test_hash";

export function main(): void
{
    test_hash();

    //----
    // ALGORITHM
    //----
    

    //----
    // CONTAINERS
    //----
    // LINEAR
    test_vector();
    test_deque();
    test_list();
    // test_forward_list();

    // ASSOCIATIVE CONTAINERS
    test_tree_map();
    test_tree_multi_map();
    test_tree_multi_set();
    test_tree_set();

    test_hash_map();
    test_hash_multi_map();
    test_hash_multi_set();
    test_hash_set();

    // ADAPTOR CONTAINERS
    test_priority_queue();
    test_queue();
    test_stack();

    // ETC
    test_storing_objects();
}