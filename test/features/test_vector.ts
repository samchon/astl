import { Vector } from "../../container/Vector";

export function test_vector(): void
{
    const v: Vector<i32> = new Vector();
    for (let i: i32 = 0; i < 10; ++i)
        v.push_back(i);

    v.set(3, 100);
    for (let i: usize = 0; i < v.size(); ++i)
        trace("element " + v.at(i).toString());
}