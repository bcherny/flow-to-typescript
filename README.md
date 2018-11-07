# Flow-to-TypeScript [![Build Status][build]](https://circleci.com/gh/bcherny/flow-to-typescript) [![npm]](https://www.npmjs.com/package/flow-to-typescript) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/flow-to-typescript.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/flow-to-typescript.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/flow-to-typescript.svg?style=flat-square

> Compile Flow files to TypeScript

**In Pre-Alpha - contributions welcome.**

## Installation

```sh
# Using Yarn:
yarn add flow-to-typescript

# Or, using NPM:
npm install flow-to-typescript --save
```

## Usage

### CLI

```sh
# Install globally
yarn global add flow-to-typescript

# Compile a file (all of these are equivalent)
flow2ts my/file.js.flow
flow2ts my/file.js.flow my/file.ts
flow2ts my/file.js.flow > my/file.ts
flow2ts -i my/file.js.flow -o my/file.ts
flow2ts --input my/file.js.flow --output my/file.ts
```

### Programmatic

```js
import { compile } from 'flow-to-typescript'
import { readFileSync, writeFileSync } from 'fs'

let path = 'path/to/file.js.flow'
let file = readFileSync(path, 'utf-8')

compile(file, path).then(ts =>
  writeFileSync('path/to/file.ts', ts)
)
```

## TypeScript vs. Flow

### Features

| Done? |             | Flow                                    | TypeScript |
|-------|-------------|-----------------------------------------|------------|
|   ✅  | Maybe       | `?type` (NullableTypeAnnotation)        | `type \| null \| undefined` |
|   ✅  | Null        | `null`                                  | `null` |
|   ✅  | Undefined   | `typeof undefined`                      | `undefined` |
|   ✅  | Mixed       | `mixed`                                 | `unknown` |
|   ✅  | Void        | `void`                                  | `void` |
|   ✅  | Functions   | `(A, B) => C`                           | `(a: A, b: B) => C` |
|   ⚔  | Predicates (0) | `(a: A, b: B) => %checks`            | `(a: A, b: B) => C` |
|   ⚔  | Predicates (1) | `(a: A, b: B) => C %checks`          | `(a: A, b: B) => C` |
|   ✅  | Exact types | `{\| a: A \|}`                            | `{ a: A }` |
|   ✅  | Indexers    | `{ [A]: B }`                            | `{ [a: A]: B }` |
|   ✅  | Opaque types | `opaque type A = B`                    | `type A = B` (not expressible) |
|   ✅  | Variance    | `interface A { +b: B, -c: C }`          | `interface A { readonly b: B, c: C }` |
|   ✅  | Bounds      | `<A: string>`                           | `<A extends string>` |
|   ✅  | Casting     | `(a: A)`                                | `(a as A)` |
|   ✅  | Import default type | `import type A from './b'`          | `import A from './b'` |
|   ✅  | Import named type | `import type { A } from './b'`          | `import { A } from './b'` |

### Utilities

| Done? |             | Flow                                    | TypeScript |
|-------|-------------|-----------------------------------------|------------|
|       | Keys        | `$Keys<A>`                              | `keyof A` |
|       | Values      | `$Values<A>`                            | `A[keyof A]` |
|   ✅  | ReadOnly    | `$ReadOnly<A>`                          | `Readonly<A>` |
|   ✅  | Exact       | `$Exact<A>`                             | `A` |
|       | Difference  | `$Diff<A, B>`                           | TODO` |
|       | Rest        | `$Rest<A, B>`                           | `Exclude` |
|       | Property type | `$PropertyType<T, k>`                 | `T[k]` |
|       | Element type | `$ElementType<T, K>`                   | `T[k]` |
|       | Dependent type | `$ObjMap<T, F>`                      | TODO |
|       | Mapped tuple | `$TupleMap<T, F>`                      | TODO |
|       | Return type | `$Call<F>`                              | `ReturnType` |
|       | Class       | `Class<A>`                              | `typeof A` |
|       | Supertype   | `$Supertype<A>`                         | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/14520) |
|       | Subtype     | `$Subtype<A>`                           | `B extends A` |
|       | Existential type | `*`                                | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/14466) |


✅ Done

⚔ Babylon doesn't support it (yet)
