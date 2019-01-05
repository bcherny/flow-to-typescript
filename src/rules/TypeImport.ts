import { importDeclaration } from '@babel/types'
import { addRule } from '../'

addRule('TypeImport', () => ({
  ImportDeclaration(path) {
    if ((path as any).node.importKind === 'type') {
      path.replaceWith(
        importDeclaration(path.node.specifiers, path.node.source)
      )
    }
  }
}))
