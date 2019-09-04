import { addRule } from '..'
import { typeAliasToTsTypeAliasDeclaration } from '../convert'

addRule('TypeAlias', () => ({
  TypeAlias(path) {
    path.replaceWith(typeAliasToTsTypeAliasDeclaration(path.node))
  }
}))
