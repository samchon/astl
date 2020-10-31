import { List } from "../../container/List";

export function test_list(): void
{
    const container: List<i32> = new List();
    for (let i: i32 = 0; i < 10; ++i)
        container.push_back(i);

    trace("#" + container.size().toString());
    for (let it = container.begin(); it !== container.end(); it = it.next())
        trace(it.value.toString());
}