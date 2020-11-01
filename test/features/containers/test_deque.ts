import { Deque } from "../../../container/Deque";
import { advance } from "../../../iterator/global";

export function test_deque(): void
{
    // INSERT ELEMENTS
    const container: Deque<i32> = new Deque();
    for (let i: i32 = 0; i < 1000; ++i)
        container.push_back(i);

    // VALIDATE SIZE
    if (container.size() !== 1000)
        throw new Error("Bug on Deque.size(): size is not 1000, but " + container.size().toString());

    // VALIDATE ELEMENTS
    let sum: i32 = 0;
    for (let it = container.begin(); it != container.end(); it = it.next())
        sum += it.value;
    
    if (sum !== 999 * 1000 / 2)
        throw new Error("Bug on Deque's elements: sum of the elements are not " + (1000 * 1001 / 2).toString() + " but " + sum.toString());

    // ERASE 27
    let it = advance(container.begin(), 27);
    it = container.erase(it);

    if (it.value !== 28)
        throw new Error("Bug on Deque.erase(): must be 28 but " + it.value.toString());
    
    // INSERT AN ELEMENT
    it = advance(container.begin(), 271);
    it = container.insert(it, -1);

    if (it.value !== -1)
        throw new Error("Bug on Deque.insert(): must be -1 but " + it.value.toString());

    // ERASE RANGE
    it = advance(container.begin(), 680);
    it = container.erase(it, advance(it, 300)); // erase from 680 to 980

    if (it.value !== 980)
        throw new Error("Bug on Deque.erase(): must be 980 but " + it.value.toString());
    else if (container.size() !== 700)
        throw new Error("Bug on Deque.size(): must be 700 but " + container.size().toString());
}