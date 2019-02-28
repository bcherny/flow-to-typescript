import { addRule } from '..'
import { typeAliasToTsTypeAliasDeclaration } from '../convert'

addRule('TypeAlias', (warnings) => ({
  TypeAlias(path) {
    path.replaceWith(typeAliasToTsTypeAliasDeclaration(path.node, warnings))
  }
}))
