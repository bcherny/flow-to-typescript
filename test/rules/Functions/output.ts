type Functions1 = (a: number, b: string) => string;
type Functions2 = (a: number, b: string) => string;

function f3(a: number, ...strs: Array<string | null | undefined>) {
  console.log("Hello");
}

async function f4(a: number, ...strs: Array<string | null | undefined>) {
  await Promise.resolve(123);
}

declare namespace testMod {
  function createElement<T>(defaultValue: T, calculateChangedBits: (a: T, b: T) => number | null | undefined): number;
}
