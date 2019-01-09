import {
  genericTypeAnnotation,
  identifier,
  nullLiteralTypeAnnotation,
  unionTypeAnnotation
} from '@babel/types'
import { addRule } from '../'

addRule('Maybe', () => ({
  NullableTypeAnnotation(path) {
    path.replaceWith(
      unionTypeAnnotation([
        (path.node as any).typeAnnotation,
        nullLiteralTypeAnnotation(),
        genericTypeAnnotation(identifier('undefined'))
      ])
    )
  }
}))
