import { addRule } from '..'
import { toTs } from '../convert'

addRule('InterfaceDeclaration', (warnings) => ({
  InterfaceDeclaration(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
