# Flow-to-TypeScript [![Build Status][build]](https://circleci.com/gh/bcherny/flow-to-typescript) [![npm]](https://www.npmjs.com/package/flow-to-typescript) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/flow-to-typescript.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/flow-to-typescript.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/flow-to-typescript.svg?style=flat-square

> Compile Flow files to TypeScript

Coming soon...

## TypeScript vs. Flow

### Features

| Done? |             | Flow                                    | TypeScript |
|-------|-------------|-----------------------------------------|------------|
|   ✅  | Maybe       | `?type` (NullableTypeAnnotation)        | `type | null | undefined` |
|   ✅  | Undefined   | `void`                                  | `undefined` |
|       | Mixed       | `mixed`                                 | `{}` |
|       | Functions   | `(A, B) => C`                           | `(a: A, b: B) => C` |
|       | Predicates (0) | `(a: A, b: B) => %checks`            | `(a: A, b: B) => C` |
|       | Predicates (1) | `(a: A, b: B) => C %checks`          | `(a: A, b: B) => C` |
|       | Exact types | `{| a: A |}`                            | `{ a: A }` (not expressible) |
|       | Indexers    | `{ [A]: B }`                            | `{ [a: A]: B }` |
|       | Opaque types | `opaque type A = B`                    | `type A = B` (not expressible) |
|       | Variance    | `interface A { +b: B, -c: C }`          | `interface A { readonly b: B, c: C }` |
|       | Bounds      | `<A: string>`                           | `<A extends string>` |
|       | Casting     | `(a: A)`                                | `(a as A)` |
|       | Import type (0) | `import type A from './b'`          | `import A from './b'` |
|       | Import type (1) | `import type { A } from './b'`          | `import { A } from './b'` |

### Utilities

| Done? |             | Flow                                    | TypeScript |
|-------|-------------|-----------------------------------------|------------|
|       | Keys        | `$Keys<A>`                              | `keyof A` |
|       | Values      | `$Values<A>`                            | `A[keyof A]` |
|       | ReadOnly    | `$ReadOnly<A>`                          | `Readonly<A>` |
|       | Exact       | `$Exact<A>`                             | `A` |
|       | Difference  | `$Diff<A, B>`                           | `A | B` |
|       | Rest        | `$Rest<A, B>`                           | TODO |
|       | Property type | `$PropertyType<T, k>`                 | `T[k]` |
|       | Element type | `$ElementType<T, K>`                   | `T[k]` |
|       | Dependent type | `$ObjMap<T, F>`                      | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/20352) |
|       | Mapped tuple | `$TupleMap<T, F>`                      | `any` (warn) |
|       | Return type | `$Call<F>`                              | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/6606)
|       | Class       | `Class<A>`                              | `typeof A` |
|       | Supertype   | `$Supertype<A>`                         | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/14520) |
|       | Subtype     | `$Subtype<A>`                           | `B extends A` |
|       | Existential type | `*`                                | `any` (warn - vote for https://github.com/Microsoft/TypeScript/issues/14466) |
