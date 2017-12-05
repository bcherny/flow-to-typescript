import { objectTypeProperty } from 'babel/packages/babel-types'
import { addRule } from '../'

addRule('Variance', warnings => ({
  ObjectTypeProperty(path) {
    if ((path.node as any).variance) {
      if ((path.node as any).variance === 'minus') {
        warnings.push([
          `Babylon doesn't support readonly interface properties`,
          'https://github.com/babel/babel/issues/6679',
          path.node.loc.start.line,
          path.node.loc.start.column
        ])
      } else {
        warnings.push([
          `Contravariance can't be expressed in TypeScript`,
          'https://github.com/Microsoft/TypeScript/issues/1394',
          path.node.loc.start.line,
          path.node.loc.start.column
        ])
      }
      path.replaceWith(objectTypeProperty(path.node.key, path.node.value))
    }
  }
}))
