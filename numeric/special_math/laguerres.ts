import { Vector } from "../../container/Vector";

@inline
export function laguerre(n: u32, x: f64): f64
{
    return assoc_laguerre(n, 0, x);
}

export function assoc_laguerre(n: u32, m: u32, x: f64): f64
{
    const memory: Vector<f64> = new Vector();
    memory.insert_repeatedly(memory.end(), <usize>n + 1, f64.MIN_VALUE);

    return _Compute_assoc_laguerre(n, m, x, memory);
}

function _Compute_assoc_laguerre(n: u32, m: u32, x: u32, memory: Vector<f64>): f64
{
    const knock: f64 = memory.at(<usize>n)
    if (knock !== f64.MIN_VALUE)
        return knock;

    const alpha: f64 = _Compute_assoc_laguerre(n - 1, m, x, memory);
    const beta: f64 = _Compute_assoc_laguerre(n - 2, m, x, memory);
    const ret: f64 = ((2 * n - 1 + m - x) * alpha - (n + m - 1) * beta) / n;

    memory.set(<usize>n, ret);
    return ret;
}