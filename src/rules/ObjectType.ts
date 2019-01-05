import { addRule } from '../'
import { toTs } from '../convert'

addRule('ObjectType', () => ({
  ObjectTypeAnnotation(path) {
    path.replaceWith(toTs(path.node))
  }
}))
