import {
  isGenericTypeAnnotation,
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
    if (!path.node.typeParameters) {
      return
    }
    if (path.node.typeParameters.params.length !== 1) {
      return
    }
    let [firstParam] = path.node.typeParameters.params
    if (!isGenericTypeAnnotation(firstParam)) {
      return
    }
    if (!isIdentifier(firstParam.id)) {
      return
    }
    let op = tsTypeOperator(tsTypeReference(firstParam.id))
    path.replaceWith(op)
  }
}))
