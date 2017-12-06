import { booleanLiteral, FlowTypeAnnotation, isTypeParameter, Node, tSAnyKeyword, tSArrayType, tSBooleanKeyword, tSLiteralType, tSTypeParameter, TypeAnnotation, TypeParameter } from 'babel/packages/babel-types/lib'
import { addRule } from '../'
import { toTsType } from '../convert'

addRule('Bounds', () => ({
  TypeParameterDeclaration(path) {

    if (path.node.params.every(_ => !hasBound(_))) {
      return
    }

    let params = path.node.params.map(node => {
      if (hasBound(node)) {
        let a =
        return tSTypeParameter(
          toTsType(node.bound.typeAnnotation),
          node.default ? toTsType(node.default) : null
        )
      }
      return node
    })
  }
}))

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}
