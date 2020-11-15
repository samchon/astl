import { InvalidArgument } from "../../exception/InvalidArgument";

import { CMath } from "../../internal/numeric/CMath";
import { tgamma } from "./gamma";

/* ---------------------------------------------------------------
    ORIGINAL FUNCTIONS
--------------------------------------------------------------- */
export function cyl_bessel_j(v: f64, x: f64): f64
{
    if (x < 0 && Math.floor(v) !== v)
        throw new InvalidArgument("Error on std.cyl_bessel_j(): v must be integer when x is negative -> (v = " + v + ", x = " + x + ").");
    else if (x === 0 && v !== 0)
        throw new InvalidArgument("Error on std.cyl_bessel_j(): v must be zero when x is zero -> (v = " + v + ", x = " + x + ").");

    if (v === Math.floor(v))
        return _J_int(v, x);
    else
        return _J_positive(v, x);
}

export function cyl_neumann(v: f64, x: f64): f64
{
    if (x <= 0)
        throw new InvalidArgument("Error on std.cyl_neumann(): x must be greater than zero -> (x = " + x + ").");

    const numerator: f64 = cyl_bessel_j(v, x) * Math.cos(v*Math.PI) - cyl_bessel_j(-v, x)
    const denominator: f64 = Math.sin(v * Math.PI);
    
    return numerator / denominator;
}

@inline()
export function sph_bessel(v: f64, x: f64): f64
{
    return Math.sqrt(Math.PI / (2 * x)) * cyl_bessel_j(v + .5, x);
}

@inline()
export function sph_neumann(v: f64, x: f64): f64
{
    return Math.sqrt(Math.PI / (2 * x)) * cyl_neumann(v + .5, x);
}

@inline()
function _J_int(v: f64, x: f64): f64
{
    if (v < 0)
        return Math.pow(-1, v) * _J_positive(-v, x);
    else
        return _J_positive(v, x);
}

function _J_positive(v: f64, x: f64): f64
{
    let sigma: f64 = 0;
    for (let k: usize = 0; k <= INFINITY; ++k)
    {
        const numerator: f64 = Math.pow(x / 2, v + 2 * k);
        const denominator: f64 = CMath.factorial(k) * tgamma(v + k + 1);

        sigma += numerator / denominator;
    }
    return sigma;
}

const INFINITY: usize = 100;

/* ---------------------------------------------------------------
    REGULAR MODIFIED
--------------------------------------------------------------- */
export function cyl_bessel_i(n: u32, x: f64): f64
{
    if (x === 0 && n !== 0)
        throw new InvalidArgument("Error on std.cyl_bessel_i(): n must be zero when x is zero -> (n = " + n + ", x = " + x + ").");
    else if (n === .5)
        return Math.sqrt(2.0 / (Math.PI*x)) * Math.sinh(x);
    
    let sigma: f64 = 0;
    for (let k: usize = 0; k <= INFINITY; ++k)
    {
        const numerator: f64 = Math.pow(x / 2, n + 2*k);
        const denominator: f64 = CMath.factorial(k) * tgamma(n + k + 1);

        sigma += numerator / denominator;
    }
    return sigma;
}

export function cyl_bessel_k(n: u32, x: f64): f64
{
    if (x <= 0)
        throw new InvalidArgument("Error on std.cyl_bessel_k(): requires x > 0 -> (x = " + x + ").");

    let ret: f64 = Math.PI / 2;
    ret *= cyl_bessel_i(-n, x) - cyl_bessel_i(n, x);
    ret /= Math.sin(n * Math.PI);

    return ret;
}