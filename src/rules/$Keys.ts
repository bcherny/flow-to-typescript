import { GenericTypeAnnotation, tSTypeOperator, tSTypeReference } from 'babel/packages/babel-types'
import { addRule } from '../'

addRule('$Keys', () => ({
  GenericTypeAnnotation(path) {
    if (path.node.id.name !== '$Keys') {
      return
    }
    let { id } = (path.node.typeParameters.params[0] as GenericTypeAnnotation)
    let op = tSTypeOperator(tSTypeReference(id))
    path.replaceWith(op)
  }
}))
