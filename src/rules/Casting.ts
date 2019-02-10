import { addRule } from '../'
import { toTS } from '../convert'

addRule('Casting', () => ({
  TypeCastExpression(path) {
    path.replaceWith(toTS(path.node))
  }
}))
