import { genericTypeAnnotation, identifier } from '@babel/types'
import { addRule } from '../index'

addRule('Undefined', () => ({
  VoidTypeAnnotation(path) {
    path.replaceWith(genericTypeAnnotation(identifier('undefined')))
  }
}))
