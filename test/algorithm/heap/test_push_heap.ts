import { StopWatch } from "../../internal/StopWatch";
import { test_priority_queue } from "../../features/containers/test_priority_queue";

export function test_push_heap(): void
{
    StopWatch.measure("test_push_heap", test_priority_queue.core);
}