import { addRule } from '../'
import { toTs } from '../convert'

addRule('Casting', () => ({
  TypeCastExpression(path) {
    path.replaceWith(toTs(path.node))
  }
}))
