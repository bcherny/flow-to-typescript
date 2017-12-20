import { addRule } from '../'
import { toTs } from '../convert'

addRule('Functions', () => ({
  FunctionTypeAnnotation(path) {
    path.replaceWith(toTs(path.node))
  }
}))
