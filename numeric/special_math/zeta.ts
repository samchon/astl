import { tgamma } from "./gamma";

export function riemann_zeta(arg: f64): f64
{
    if (arg < 0)
        return _Negative(arg);
    else if (arg === 0)
        return -0.5;
    else if (arg < 1)
        return _Fractional(arg);
    else if (arg === 1)
        return Infinity;
    else
        return _Positive(arg);
}

function _Negative(arg: f64): f64
{
    return Math.pow(2, arg)
        * Math.pow(Math.PI, arg - 1)
        * Math.sin(Math.PI * arg / 2)
        * tgamma(1 - arg)
        * riemann_zeta(1 - arg);
}

function _Fractional(arg: f64): f64
{
    const divider: f64 = 1 - Math.pow(2, 1 - arg);

    let sigma: f64 = 0;
    for (let k: usize = 1; k <= INFINITY; ++k)
        sigma += Math.pow(-1, k - 1) * Math.pow(k, -arg);

    return sigma / divider;
}

function _Positive(arg: f64): f64
{
    let sigma: f64 = 0;
    for (let k: usize = 1; k <= INFINITY; ++k)
        sigma += Math.pow(k, -arg);
    return sigma;
}

const INFINITY: usize = 100 * 1000;