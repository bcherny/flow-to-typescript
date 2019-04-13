import { genericTypeAnnotation, identifier, isIdentifier } from '@babel/types'
import { addRule } from '../'

addRule('$ReadOnly', () => ({
  GenericTypeAnnotation(path) {
    if (!isIdentifier(path.node.id)) {
      return
    }
    if (path.node.id.name !== '$ReadOnly') {
      return
    }

    path.replaceWith(
      genericTypeAnnotation(identifier('Readonly'), path.node.typeParameters)
    )
  }
}))
