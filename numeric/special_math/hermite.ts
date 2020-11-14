import { Vector } from "../../container/Vector";

export function hermite(n: u32, x: f64): f64
{
    const memory: Vector<f64> = new Vector();
    memory.insert_repeatedly(memory.end(), <usize>n + 1, f64.MIN_VALUE);

    return _Hermite(n, x, memory);
}

function _Hermite(n: u32, x: f64, memory: Vector<f64>): f64
{
    const knock: f64 = memory.at(<usize>n);
    if (knock !== f64.MIN_VALUE)
        return knock;

    const alpha: f64 = _Hermite(n - 1, x, memory);
    const beta: f64 = _Hermite(n - 2, x, memory);
    const ret: f64 = 2 * (x * alpha - (n - 1) * beta);

    memory.set(<usize>n, ret);
    return ret;
}