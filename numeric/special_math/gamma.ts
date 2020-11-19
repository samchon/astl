export function tgamma(x: f64): f64
{
    if (x < 0.5)
        return Math.PI / (Math.sin(Math.PI * x) * tgamma(1 - x));

    x -= 1;
    let a: f64 = P[0];
    const t: f64 = x + G + 0.5;
    
    for (let i: i32 = 1; i < P.length; ++i)
        a += P[i] / (x + i);
    
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}

@inline
export function lgamma(x: f64): f64
{
    return Math.log(tgamma(x));
}

const P: f64[] = 
[
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
];
const G: f64 = 7;