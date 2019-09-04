import { addRule } from '..'
import { toTs } from '../convert'

addRule('TypeAnnotation', () => ({
  TypeAnnotation(path) {
    path.replaceWith(toTs(path.node))
  }
}))
