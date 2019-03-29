import { addRule } from '../'
import { toTs } from '../convert'

addRule('Functions', () => ({
  FunctionTypeAnnotation(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
