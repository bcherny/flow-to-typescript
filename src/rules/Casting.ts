import { addRule } from '../'
import { ts } from '../convert'

addRule('Casting', () => ({
  TypeCastExpression(path) {
    path.replaceWith(ts(path.node))
  }
}))
