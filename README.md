# AssemblyScript Standard Template Library
![logo](https://user-images.githubusercontent.com/13158709/98328610-7b5f4d00-2039-11eb-8135-6cf8100a12b3.png)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/astl/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/astl.svg)](https://www.npmjs.com/package/astl)
[![Downloads](https://img.shields.io/npm/dm/astl.svg)](https://www.npmjs.com/package/astl)
[![Build Status](https://github.com/samchon/astl/workflows/build/badge.svg)](https://github.com/samchon/astl/actions?query=workflow%3Abuild)

Implementation of STL (Standard Template Library) for the AssemblyScript.

  - Containers
  - Iterators
  - Algorithms
  - Functors

**ASTL** is an open-source project providing features of the STL, migrated from the *C++* to the *AssemblyScript*. You can enjoy those STL's own specific *containers*, *algorithms* and *functors* in the AssemblyScript.

Below components are list of the provided objects in the **ASTL**.




## Features
### Containers
  - **Linear Conatainers**
    - `Vector`
    - `Deque`
    - `List`
    - `ForwardList`
    - `VectorBoolean`
  - **Associative Containers**
    - *Tree-structured ontainers*
      - `TreeMap`
      - `TreeMultiMap`
      - `TreeMultiSet`
      - `TreeSet`
    - *Hash-buckets based containers*
      - `HashMap`
      - `HashMultiMap`
      - `HashMultiSet`
      - `HashSet`
  - **Adaptor Containers**
    - *Linear adaptors*
      - `Stack`
      - `Queue`
      - `PriorityQueue`
    - *Associative adaptors*
      - `experimental.FlatMap`
      - `experimental.FlatMultiMap`
      - `experimental.FlatMultiSet`
      - `experimental.FlatSet`
      - `experimental.LightMap`
      - `experimental.LightSet`

### Algorithms
  - `<algorithm>`
    - *binary_search*
    - *heap*
    - *iterations*
    - *mathematics*
    - *merge*
    - *modifiers*
    - *partition*
    - *sorting*
    - *union_set*

### Functors
  - `<exception>`
    - Exception
      - LogicError
      - RntimeError
  - `<functional>`
    - *comparators*
    - *hash*
  - `<numeric>`
    - *operators*
    - *operations*
    - *special_math*
  - `<utility>`
  



## Installation
### NPM Module
Installing the **ASTL** in the *NodeJS* environment is very easy. Just install with the `npm`.

```bash
npm install --save astl
```
### Usage
```typescript
import std from "astl";

function main(): void
{
    const map: std.TreeMap<i32, string> = new std.TreeMap();

    map.emplace(1, "First");
    map.emplace(4, "Fourth");
    map.emplace(5, "Fifth");
    map.set(9, "Nineth");

    for (let it = map.begin(); it != map.end(); it = it.next())
        trace(it.first.toString() + ", " + it.second);

    const it: std.TreeMap.Iterator<i32, string> = map.lower_bound(3);
    trace("lower_bound() of 3 is: " + it.first.toString());
}
main();
```