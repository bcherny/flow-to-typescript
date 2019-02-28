import {
  GenericTypeAnnotation,
  tsTypeOperator,
  tsTypeReference,
  isIdentifier
} from '@babel/types'
import { addRule } from '../'

addRule('$Keys', () => ({
  GenericTypeAnnotation(path) {
    if (!isIdentifier(path.node.id) || path.node.id.name !== '$Keys') {
      return
    }
    if (!path.node.typeParameters) {
      return
    }
    let { id } = path.node.typeParameters.params[0] as GenericTypeAnnotation
    if (!isIdentifier(id)) {
      return
    }
    let op = tsTypeOperator(tsTypeReference(id))
    path.replaceWith(op)
  }
}))
