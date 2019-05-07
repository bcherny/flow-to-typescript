addRule("Casting", () => ({
  TypeCastExpression(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
