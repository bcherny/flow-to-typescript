import { importDeclaration } from '@babel/types'
import { addRule } from '../'

addRule('TypeImport', () => ({
  ImportDeclaration(path) {
    if (path.node.importKind === 'type') {
      path.replaceWith(
        importDeclaration(path.node.specifiers, path.node.source)
      )
    }
  }
}))
