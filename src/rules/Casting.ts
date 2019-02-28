import { addRule } from '../'
import { toTs } from '../convert'

addRule('Casting', (warnings) => ({
  TypeCastExpression(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
