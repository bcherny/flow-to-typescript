import { objectTypeAnnotation } from 'babel-types'
import { addRule } from '../'

addRule('Exact', {
  ObjectTypeAnnotation(path) {
    if ((path.node as any).exact) {
      path.replaceWith(objectTypeAnnotation(
        path.node.properties,
        path.node.indexers,
        path.node.callProperties
      ))
    }
  }
})
