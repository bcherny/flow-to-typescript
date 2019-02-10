import * as t from '@babel/types'
import { addRule } from '../'

addRule('Mixed', () => ({
  MixedTypeAnnotation(path) {
    path.replaceWith(t.tsUnknownKeyword())
  }
}))
