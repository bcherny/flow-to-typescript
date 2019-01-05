import { addRule } from '..'
import { toTs } from '../convert'

addRule('TypeAlias', () => ({
  TypeAlias(path) {
    path.replaceWith(toTs(path.node))
  }
}))
