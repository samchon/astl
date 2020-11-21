import { benchmark_arraies } from "./features/vs_native_containers/benchmark_arraies";
import { benchmark_maps } from "./features/vs_native_containers/benchmark_maps";
import { benchmark_sets } from "./features/vs_native_containers/benchmark_sets";

export function main(): void
{
    let content: string = "\n# Benchmark\n"
        + "## ASTL vs Native Containers\n"
        + benchmark_arraies() + "\n"
        + benchmark_sets() + "\n"
        + benchmark_maps() + "\n"
    ;

    trace(content);
}