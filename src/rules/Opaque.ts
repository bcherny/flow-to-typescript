import { typeAlias } from '@babel/types'
import { addRule } from '../'

addRule('Opaque', warnings => ({
  enter(path) {
    if (path.type === 'OpaqueType') {
      warnings.push([
        `Opaque types can't be expressed in TypeScript`,
        'https://github.com/Microsoft/TypeScript/issues/202',
        path.node.loc ? path.node.loc.start.line : -1,
        path.node.loc ? path.node.loc.start.column : -1
      ])
      path.replaceWith(
        typeAlias(
          (path.node as any).id,
          (path.node as any).typeParameters,
          (path.node as any).impltype
        )
      )
    }
  }
}))
