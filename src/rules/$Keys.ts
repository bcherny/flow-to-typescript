import {
  GenericTypeAnnotation,
  isIdentifier,
  tsTypeOperator,
  tsTypeReference
} from '@babel/types'
import { addRule } from '../'

addRule('$Keys', () => ({
  GenericTypeAnnotation(path) {
    if (!isIdentifier(path.node.id)) {
      return
    }
    if (path.node.id.name !== '$Keys') {
      return
    }
    let { id } = path.node.typeParameters!.params[0] as GenericTypeAnnotation
    let op = tsTypeOperator(tsTypeReference(id as any))
    path.replaceWith(op)
  }
}))
