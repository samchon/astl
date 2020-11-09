//----
// ALGORITHM
//----
// BINARY-SERACH
import { test_binary_search } from "./algorithm/binary_search/test_binary_search";
import { test_equal_range } from "./algorithm/binary_search/test_equal_range";
import { test_lower_bound } from "./algorithm/binary_search/test_lower_bound";
import { test_upper_bound } from "./algorithm/binary_search/test_upper_bound";

// HEAP
import { test_make_heap } from "./algorithm/heap/test_make_heap";
import { test_push_heap } from "./algorithm/heap/test_push_heap";
import { test_sort_heap } from "./algorithm/heap/test_sort_heap";

// MATHEMATICS
import { test_max_element } from "./algorithm/mathematics/test_max_element";
import { test_min_element } from "./algorithm/mathematics/test_min_element";
import { test_minmax_element } from "./algorithm/mathematics/test_minmax_element";
import { test_next_permutation } from "./algorithm/mathematics/test_next_permutation";
import { test_prev_permutation } from "./algorithm/mathematics/test_prev_permutation";

// RANDOM
import { test_randint } from "./algorithm/random/test_randint";
import { test_sample } from "./algorithm/random/test_sample";

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

//----
// FUNCTIONAL
//----
import { test_hash } from "./features/functional/test_hash";

export function main(): void
{
    //----
    // ALGORITHM
    //----
    // BINARY SEARCH
    test_binary_search();
    test_equal_range();
    test_lower_bound();
    test_upper_bound();

    // HEAP
    test_make_heap();
    test_push_heap();
    // test_sort_heap();

    // MATHEMATICS
    test_max_element();
    test_min_element();
    test_minmax_element();
    test_next_permutation();
    test_prev_permutation();

    // RANDOM
    test_randint();
    test_sample();

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

    //----
    // FUNCTIONAL
    //----
    test_hash();
}