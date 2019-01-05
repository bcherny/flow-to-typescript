import {
  GenericTypeAnnotation,
  tsTypeOperator,
  tsTypeReference
} from '@babel/types'
import { addRule } from '../'

addRule('$Keys', () => ({
  GenericTypeAnnotation(path) {
    if (path.node.id.name !== '$Keys') {
      return
    }
    let { id } = path.node.typeParameters.params[0] as GenericTypeAnnotation
    let op = tsTypeOperator(tsTypeReference(id))
    path.replaceWith(op)
  }
}))
