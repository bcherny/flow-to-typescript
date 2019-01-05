import {
  isTypeParameter,
  Node,
  TypeAnnotation,
  TypeParameter
} from '@babel/types'
import { addRule } from '../'
import { toTs } from '../convert'

addRule('Bounds', () => ({
  TypeParameterDeclaration(path) {
    if (path.node.params.every(_ => !hasBound(_))) {
      return
    }

    path.replaceWith(toTs(path.node))
  }
}))

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}
