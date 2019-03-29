import { genericTypeAnnotation, identifier } from '@babel/types'
import { addRule } from '../'

addRule('$ReadOnly', () => ({
  GenericTypeAnnotation(path: any) {
    if (path.node.id.name !== '$ReadOnly') {
      return
    }

    path.replaceWith(
      genericTypeAnnotation(identifier('Readonly'), path.node.typeParameters)
    )
  }
}))
