import { addRule } from '../'
import { toTS } from '../convert'

addRule('Functions', () => ({
  FunctionTypeAnnotation(path) {
    path.replaceWith(toTS(path.node))
  }
}))
