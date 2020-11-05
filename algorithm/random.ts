export function randint<T>(x: T, y: T): T
{
    const value: f64 = Math.round(Math.random() * (y - x));
    return <T>value;
}