import { addRule } from '..'
import { toTs } from '../convert'

addRule('TypeAnnotation', (warnings) => ({
  TypeAnnotation(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
