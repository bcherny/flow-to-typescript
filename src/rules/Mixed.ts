import { objectTypeAnnotation } from '@babel/types'
import { addRule } from '../'

addRule('Mixed', () => ({
  MixedTypeAnnotation(path: any) {
    path.replaceWith(objectTypeAnnotation([]))
  }
}))
