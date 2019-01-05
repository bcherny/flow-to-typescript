import { identifier, objectTypeIndexer } from '@babel/types'
import { addRule } from '../'
import { generateFreeIdentifier } from '../utils'

addRule('Indexer', () => ({
  ObjectTypeIndexer(path) {
    if (path.node.id !== null) {
      return
    }

    path.replaceWith(
      objectTypeIndexer(
        identifier(generateFreeIdentifier([])),
        path.node.key,
        path.node.value
      )
    )
  }
}))
