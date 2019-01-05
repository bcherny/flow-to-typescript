import { addRule } from '../'

addRule('$Exact', warnings => ({
  GenericTypeAnnotation(path) {
    if (path.node.id.name !== '$Exact') {
      return
    }

    warnings.push([
      `$Exact types can't be expressed in TypeScript`,
      'https://github.com/Microsoft/TypeScript/issues/12936',
      path.node.loc.start.line,
      path.node.loc.start.column
    ])

    path.replaceWith(path.node.typeParameters.params[0])
  }
}))
