/* @flow */

type Functions1 = (number, string) => string

type Functions2 = (a: number, string) => string

function f3(a:number,...strs:Array<?string>) {
  console.log("Hello");
}

async function f4(a: number, ...strs: Array<?string>) {
  await Promise.resolve(123);
}

declare module testMod {
  declare function createElement<T>(defaultValue: T, calculateChangedBits: (a: T, b: T) => ?number): number;
}
