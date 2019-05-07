addRule("Functions", () => ({
  FunctionTypeAnnotation(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
