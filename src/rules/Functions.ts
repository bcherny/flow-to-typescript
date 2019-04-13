import { addRule } from '../'
import { ts } from '../convert'

addRule('Functions', () => ({
  FunctionTypeAnnotation(path) {
    path.replaceWith(ts(path.node))
  }
}))
