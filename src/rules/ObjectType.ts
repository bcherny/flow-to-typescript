import { addRule } from '../'
import { toTs } from '../convert'

addRule('ObjectType', (warnings) => ({
  ObjectTypeAnnotation(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
