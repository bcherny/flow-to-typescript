function foo(x: string | null | undefined): string {
  if (x) {
    return x;
  }
  return "default string";
}
