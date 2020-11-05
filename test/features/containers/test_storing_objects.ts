import std from "../../../index";

class Capsule<T>
{
    constructor(public value: T)
    {
        
    }
    
    @operator("<")
    public less(obj: Capsule<T>): boolean
    {
        return this.value < obj.value;
    }

    @operator("==")
    public equals(obj: Capsule<T>): boolean
    {
        return this.value == obj.value;
    }
}

export function test_storing_objects(): void
{
    const v: std.Vector<Capsule<i32>> = new std.Vector();
    const l: std.List<Capsule<i32>> = new std.List();
    const d: std.Deque<Capsule<i32>> = new std.Deque();

    const hm: std.HashMap<Capsule<i32>, usize> = new std.HashMap();
    const hmm: std.HashMultiMap<Capsule<i32>, usize> = new std.HashMultiMap();
    const hms: std.HashMultiSet<Capsule<i32>> = new std.HashMultiSet();
    const hs: std.HashSet<Capsule<i32>> = new std.HashSet();

    const tm: std.TreeMap<Capsule<i32>, usize> = new std.TreeMap();
    const tmm: std.TreeMultiMap<Capsule<i32>, usize> = new std.TreeMultiMap();
    const tms: std.TreeMultiSet<Capsule<i32>> = new std.TreeMultiSet();
    const ts: std.TreeSet<Capsule<i32>> = new std.TreeSet();

    const s: std.Stack<Capsule<i32>> = new std.Stack();
    const q: std.Queue<Capsule<i32>> = new std.Queue();
    const pq: std.PriorityQueue<Capsule<i32>> = new std.PriorityQueue();
}