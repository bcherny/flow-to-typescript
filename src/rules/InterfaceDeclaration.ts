import { addRule } from '..'
import { toTs } from '../convert'

addRule('InterfaceDeclaration', () => ({
  InterfaceDeclaration(path) {
    path.replaceWith(toTs(path.node))
  }
}))
