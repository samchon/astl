//----
// ALGORITHM
//----
// BINARY-SERACH
import { test_binary_search } from "./features/algorithm/binary_search/test_binary_search";
import { test_equal_range } from "./features/algorithm/binary_search/test_equal_range";
import { test_lower_bound } from "./features/algorithm/binary_search/test_lower_bound";
import { test_upper_bound } from "./features/algorithm/binary_search/test_upper_bound";

// HEAP
import { test_make_heap } from "./features/algorithm/heap/test_make_heap";
import { test_push_heap } from "./features/algorithm/heap/test_push_heap";
import { test_sort_heap } from "./features/algorithm/heap/test_sort_heap";

// MATHEMATICS
import { test_max_element } from "./features/algorithm/mathematics/test_max_element";
import { test_min_element } from "./features/algorithm/mathematics/test_min_element";
import { test_minmax_element } from "./features/algorithm/mathematics/test_minmax_element";
import { test_next_permutation } from "./features/algorithm/mathematics/test_next_permutation";
import { test_prev_permutation } from "./features/algorithm/mathematics/test_prev_permutation";

// RANDOM
import { test_randint } from "./features/algorithm/random/test_randint";
import { test_sample } from "./features/algorithm/random/test_sample";
import { test_sort } from "./features/algorithm/sorting/test_sort";
import { test_stable_sort } from "./features/algorithm/sorting/test_stable_sort";

//----
// CONTAINERS
//----
// LINEARS
import { test_vector } from "./features/container/test_vector";
import { test_deque } from "./features/container/test_deque";
import { test_list } from "./features/container/test_list";
import { test_forward_list } from "./features/container/test_forward_list";

// ASSOCIATIVES
import { test_tree_map } from "./features/container/test_tree_map";
import { test_tree_multi_map } from "./features/container/test_tree_multi_map";
import { test_tree_multi_set } from "./features/container/test_tree_multi_set";
import { test_tree_set } from "./features/container/test_tree_set";
import { test_hash_map } from "./features/container/test_hash_map";
import { test_hash_multi_map } from "./features/container/test_hash_multi_map";
import { test_hash_multi_set } from "./features/container/test_hash_multi_set";
import { test_hash_set } from "./features/container/test_hash_set";

// ADAPTORS
import { test_priority_queue } from "./features/container/test_priority_queue";
import { test_queue } from "./features/container/test_queue";
import { test_stack } from "./features/container/test_stack";
import { test_flat_map } from "./features/experimental/containers/test_flat_map";
import { test_flat_multi_map } from "./features/experimental/containers/test_flat_multi_map";
import { test_flat_multi_set } from "./features/experimental/containers/test_flat_multi_set";
import { test_flat_set } from "./features/experimental/containers/test_flat_set";

import { test_storing_objects } from "./features/container/test_storing_objects";

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
    // test_make_heap();
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
    test_sort();
    test_stable_sort();

    //----
    // CONTAINERS
    //----
    // LINEAR
    test_vector();
    test_deque();
    test_list();
    test_forward_list();

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
    test_flat_map();
    test_flat_multi_map();
    test_flat_multi_set();
    test_flat_set();

    // ETC
    test_storing_objects();

    //----
    // FUNCTIONAL
    //----
    test_hash();
}