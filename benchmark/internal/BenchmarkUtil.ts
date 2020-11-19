export namespace BenchmarkUtil
{
    export function measure(title: string, tasks: Procedure[]): string
    {
        let content: string = title;
        for (let i: i32 = 0; i < tasks.length; ++i)
            content += " | " + elapse(tasks[i]).toString() + " ms";
        return content;
    }

    function elapse(task: Procedure): i64
    {
        const time: i64 = Date.now();
        task();
        return Date.now() - time;
    }

    type Procedure = () => void;
}