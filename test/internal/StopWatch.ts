export namespace StopWatch
{
    export function measure(title: string, closure: () => void): void
    {
        const time = Date.now();
        closure();

        trace(title + " - " + (Date.now() - time).toString() + " ms");
    }
}