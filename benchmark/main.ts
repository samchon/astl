import { benchmark_vector } from "./features/benchmark_vector";

export function main(): void
{
    let content: string = "\n# Benchmark";
    content += benchmark_vector();

    trace(content);
}