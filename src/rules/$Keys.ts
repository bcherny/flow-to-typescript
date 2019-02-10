import * as t from '@babel/types'
import { addRule } from '../'

addRule('$Keys', () => ({
  GenericTypeAnnotation(path) {
    if (!t.isIdentifier(path.node.id) || path.node.id.name !== '$Keys') {
      return
    }
    if (!path.node.typeParameters) {
      return
    }
    let [param] = path.node.typeParameters.params
    if (!t.isGenericTypeAnnotation(param) || !t.isIdentifier(param.id)) {
      return
    }
    let op = t.tsTypeOperator(t.tsTypeReference(param.id))
    path.replaceWith(op)
  }
}))
