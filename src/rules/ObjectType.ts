import { addRule } from '../'
import { toTs } from '../convert'

addRule('ObjectType', (warnings) => ({
  ObjectTypeAnnotation(path) {
    console.log(path.node.type)
    path.replaceWith(toTs(path.node, warnings))
  }
}))
