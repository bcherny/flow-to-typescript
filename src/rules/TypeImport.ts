import {
  importDeclaration,
  ExportNamedDeclaration,
  exportNamedDeclaration
} from '@babel/types'
import { addRule } from '../'

addRule('TypeImport', () => ({
  ImportDeclaration(path) {
    if ((path as any).node.importKind === 'type') {
      path.replaceWith(
        importDeclaration(path.node.specifiers, path.node.source)
      )
    }
  },
  ExportNamedDeclaration(path) {
    const node = path.node as ExportNamedDeclaration
    if ((node as any).exportKind === 'type') {
      path.replaceWith(
        exportNamedDeclaration(node.declaration, node.specifiers)
      )
    }
  }
}))
