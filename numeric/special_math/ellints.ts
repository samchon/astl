import { InvalidArgument } from "../../exception/InvalidArgument";

/* ---------------------------------------------------------------
    FIRST
--------------------------------------------------------------- */
export function ellint_1(k: f64, phi: f64): f64
{
    if (Math.abs(k) > 1)
        throw new InvalidArgument("Error on ellint_1(): must be |k| <= 1 -> (k = " + k.toString() +").");

    const first: f64 = Math.min(0, phi);
    const last: f64 = Math.max(0, phi);
    const interval: f64 = (last - first) / SEGMENTS;

    let ret: f64 = 0;
    for (let x: f64 = first; x < last; x += interval)
    {
        const y: f64 = 1 / _Common_formula(k, x);
        ret += y;
    }
    return ret;
}

@inline
export function comp_ellint_1(k: f64): f64
{
    return ellint_1(k, Math.PI / 2);
}

/* ---------------------------------------------------------------
    SECOND
--------------------------------------------------------------- */
export function ellint_2(k: f64, phi: f64): f64
{
    if (Math.abs(k) > 1)
        throw new InvalidArgument("Error on ellint_2(): must be |k| <= 1 -> (k = " + k.toString() +").");

    const first: f64 = Math.min(0, phi);
    const last: f64 = Math.max(0, phi);
    const interval: f64 = (last - first) / SEGMENTS;

    let ret: f64 = 0;
    for (let x: f64 = first; x < last; x += interval)
    {
        const y: f64 = _Common_formula(k, x);
        ret += y;
    }
    return ret;
}

@inline
export function comp_ellint_2(k: f64): f64
{
    return ellint_2(k, Math.PI / 2);
}

/* ---------------------------------------------------------------
    THIRD
--------------------------------------------------------------- */
export function ellint_3(k: f64, v: f64, phi: f64): f64
{
    const predicator: f64 = 1 / Math.pow(Math.sin(phi), 2);
    if (v > predicator)
        throw new InvalidArgument("Error on ellint_3(): must be v < (1 / sin^2(phi)) -> (v = " + v.toString() + ", 1 / sin^2(phi) = " + predicator.toString() + ".");
    else if (Math.abs(k) > 1)
        throw new InvalidArgument("Error on ellint_3(): must be |k| <= 1 -> (k = " + k.toString() +").");

    const first: f64 = Math.min(0, phi);
    const last: f64 = Math.max(0, phi);
    const interval: f64 = (last - first) / SEGMENTS;

    let ret: f64 = 0;
    for (let x: f64 = first; x < last; x += interval)
    {
        const denominator: f64 = (1 - v * Math.pow(Math.sin(x), 2)) * _Common_formula(k, x);
        ret += (1 / denominator);
    }
    return ret;
}

@inline
export function comp_ellint_3(k: f64, v: f64): f64
{
    return ellint_3(k, v, Math.PI / 2);
}

/* ---------------------------------------------------------------
    BACKGROUNDS
--------------------------------------------------------------- */
@inline
function _Common_formula(k: f64, x: f64): f64
{
    return Math.sqrt(1 - Math.pow(k * Math.sin(x), 2));
}

const SEGMENTS: f64 = 100 * 1000;