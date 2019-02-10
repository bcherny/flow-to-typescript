import { addRule } from '../'
import { toTS } from '../convert'

addRule('Variance', warnings => ({
  ObjectTypeProperty(path) {
    if (path.node.variance && path.node.variance.kind === 'plus') {
      warnings.push([
        `Contravariance can't be expressed in TypeScript`,
        '🗳️ Vote: https://github.com/Microsoft/TypeScript/issues/1394',
        path.node.loc!.start.line,
        path.node.loc!.start.column
      ])
    }
    path.replaceWith(toTS(path.node))
  }
}))
