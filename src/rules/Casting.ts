import { addRule } from '../'
import { toTs } from '../convert'

addRule('Casting', () => ({
  TypeCastExpression(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
