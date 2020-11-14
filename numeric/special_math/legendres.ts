import { Vector } from "../../container/Vector";

export function legendre(n: u32, x: f64): f64
{
    return assoc_legendre(n, 0, x);
}

export function assoc_legendre(n: u32, m: u32, x: f64): f64
{
    const matrix: Vector<Vector<f64>> = new Vector();
    matrix.reserve(m + 1);

    for (let i: u32 = 0; i <= m; ++i)
    {
        const memory: Vector<f64> = new Vector();
        memory.insert_repeatedly(memory.end(), <usize>n + 1, f64.MIN_VALUE);
        matrix.push_back(memory);
    }
    return _Compute_assoc_legendre(<i32>n, m, x, matrix);
}

function _Compute_legendre(n: u32, x: u32, memory: Vector<f64>): f64
{
    const knock: f64 = memory.at(<usize>n);
    if (knock !== f64.MIN_VALUE)
        return knock;
    
    const alpha: f64 = _Compute_legendre(n - 1, x, memory);
    const beta: f64 = _Compute_legendre(n - 2, x, memory);
    const ret: f64 = ((2 * n - 1) * x * alpha - (n - 1) * beta) / n;

    memory.set(<usize>n, ret);
    return ret;
}

function _Compute_assoc_legendre(n: i32, m: u32, x: f64, matrix: Vector<Vector<f64>>): f64
{
    if (n < 0)
        n = -n-1;

    const knock: f64 = matrix.at(<usize>m).at(<usize>n);
    if (knock !== f64.MIN_VALUE)
        return knock;
    else if (m === 0)
        return _Compute_legendre(n, x, matrix.front());

    const alpha: f64 = (n - m + 1) * (n - m + 2) * _Compute_assoc_legendre(<i32>n + 1, m - 1, x, matrix);
    const beta: f64 = (n + m - 1) * (n + m) * _Compute_assoc_legendre(<i32>n - 1, m - 1, x, matrix);
    const ret: f64 = ((alpha - beta) /(2 * n + 1)) / Math.sqrt(1 - x * x);

    matrix.at(m).set(n, ret);
    return ret;
}