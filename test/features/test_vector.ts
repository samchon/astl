import { Vector } from "../../container/Vector";

export function test_vector(): void
{
    const container: Vector<i32> = new Vector();
    for (let i: i32 = 0; i < 10; ++i)
        container.push_back(i);

    container.set(3, 100);
    // for (let i: usize = 0; i < container.size(); ++i)
    //     trace("element " + container.at(i).toString());
}