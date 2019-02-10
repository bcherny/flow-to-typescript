import * as t from '@babel/types'
import { addRule } from '../'

addRule('$ReadOnly', () => ({
  GenericTypeAnnotation(path) {
    if (t.isIdentifier(path.node.id) && path.node.id.name !== '$ReadOnly') {
      return
    }

    path.replaceWith(
      t.genericTypeAnnotation(t.identifier('Readonly'), path.node.typeParameters)
    )
  }
}))
