import { CMath } from "../../internal/numeric/CMath";

export function expint(x: f64): f64
{
    if (x === 0)
        return -Infinity;
    else if (x < 0)
        return -_E1_G(-x);
    else
        return _EI_Factorial(x);
}

function _EI_Factorial(x: f64): f64
{
    let ret: f64 = EULER + Math.log(Math.abs(x)) / Math.log(Math.E);
    for (let k: usize = 1; k <= 150; ++k)
        ret += Math.pow(x, k) / (k * CMath.factorial(k));
    return ret;
}

/* ---------------------------------------------------------------
    BARRY APPROXIMATION
--------------------------------------------------------------- */
function _E1_G(x: f64): f64
{
    const h: f64 = _Compute_h(x);

    let ret: f64 = G + (1-G) * Math.pow(Math.E, -x / (1-G));
    ret = Math.pow(Math.E, -x) / ret;
    
    let ln: f64 = 1 + G/x - (1-G)/Math.pow(h + B*x, 2);
    ln = Math.log(ln) / Math.log(Math.E);

    return ret * ln;
}

function _Compute_h(x: f64): f64
{
    const q: f64 = _Compute_q(x);
    const left: f64 = 1 / (1 + Math.pow(x, 1.5));
    const right: f64 = (H_INF * q) / (1 + q);

    return left + right;
}

@inline()
function _Compute_q(x: f64): f64
{
    return 20 / 47 * Math.pow(x, Math.sqrt(31 / 26));
}

const EULER: f64 = 0.57721566490153286060;
const G: f64 = Math.pow(Math.E, -EULER);
const B: f64 = Math.sqrt((2*(1-G)) / (G*(2-G)));
const H_INF: f64 = (1-G) * (G*G - 6*G + 12) / (3*G * Math.pow(2-G, 2) * B);