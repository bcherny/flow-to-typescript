import { objectTypeAnnotation } from 'babel/packages/babel-types'
import { addRule } from '../'

addRule('Mixed', () => ({
  MixedTypeAnnotation(path) {
    path.replaceWith(objectTypeAnnotation([]))
  }
}))
