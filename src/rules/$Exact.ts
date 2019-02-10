import * as t from '@babel/types'
import { addRule } from '../'

addRule('$Exact', warnings => ({
  GenericTypeAnnotation(path) {
    if (!t.isIdentifier(path.node.id)) {
      return
    }
    if (path.node.id.name !== '$Exact') {
      return
    }
    if (!path.node.typeParameters) {
      return
    }

    warnings.push([
      `$Exact types can't be expressed in TypeScript`,
      '🗳️ Vote: https://github.com/Microsoft/TypeScript/issues/12936',
      path.node.loc!.start.line,
      path.node.loc!.start.column
    ])

    path.replaceWith(path.node.typeParameters.params[0])
  }
}))
