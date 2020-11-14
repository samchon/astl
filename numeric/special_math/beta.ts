import { tgamma } from "./gamma";

@inline()
export function beta(x: f64, y: f64): f64
{
    return tgamma(x) * tgamma(y) / tgamma(x + y);
}