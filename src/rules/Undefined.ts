import { genericTypeAnnotation, identifier } from 'babel/packages/babel-types'
import { addRule } from '../index'

addRule('Undefined', () => ({
  VoidTypeAnnotation(path) {
    path.replaceWith(genericTypeAnnotation(identifier('undefined')))
  }
}))
