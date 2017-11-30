import { functionTypeAnnotation, functionTypeParam, identifier } from 'babel-types'
import { addRule } from '../'
import { generateFreeIdentifier } from '../utils'

addRule('Functions', {
  FunctionTypeAnnotation(path) {

    if (path.node.params.every(_ => _.name !== null)) {
      return
    }

    let paramNames = path.node.params.map(_ => _.name).filter(_ => _ !== null).map(_ => _.name)
    let params = path.node.params.map(param => {
      if (param.name === null) {
        let id = generateFreeIdentifier(paramNames)
        paramNames.push(id)
        return functionTypeParam(identifier(id), param.typeAnnotation)
      }
      return param
    })
    path.replaceWith(functionTypeAnnotation(path.node.typeParameters, params, path.node.rest, path.node.returnType))
  }
})
