import { objectTypeAnnotation } from 'babel-types'
import { addRule } from '../'

addRule('Exact', warnings => ({
  ObjectTypeAnnotation(path) {
    if ((path.node as any).exact) {
      warnings.push([
        `Exact types can't be expressed in TypeScript`,
        path.node.loc.start.line,
        path.node.loc.start.column
      ])
      path.replaceWith(objectTypeAnnotation(
        path.node.properties,
        path.node.indexers,
        path.node.callProperties
      ))
    }
  }
}))
