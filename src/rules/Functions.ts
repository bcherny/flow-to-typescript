import { addRule } from '../'
import { toTs } from '../convert'

addRule('Functions', (warnings) => ({
  FunctionTypeAnnotation(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
