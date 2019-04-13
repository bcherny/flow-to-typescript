import { typeAlias } from '@babel/types'
import { addRule } from '../'

addRule('Opaque', warnings => ({
  OpaqueType(path) {
    warnings.push([
      `Opaque types can't be expressed in TypeScript`,
      'https://github.com/Microsoft/TypeScript/issues/202',
      path.node.loc!.start.line,
      path.node.loc!.start.column
    ])
    path.replaceWith(
      typeAlias(
        path.node.id,
        path.node.typeParameters,
        path.node.impltype
      )
    )
  }
}))
