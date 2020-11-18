export class Pair<First, Second>
{
    public first: First;
    public second: Second;

    public constructor(first: First, second: Second)
    {
        this.first = first;
        this.second = second;
    }

    @inline()
    @operator("==")
    public equals(obj: Pair<First, Second>): boolean
    {
        return this.first == obj.first && this.second == obj.second;
    }

    @inline()
    @operator("!=")
    protected __non_equals(obj: Pair<First, Second>): boolean
    {
        return !this.equals(obj);
    }
}