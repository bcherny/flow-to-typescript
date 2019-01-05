import { addRule } from '../'
import { toTs } from '../convert'
//import { identifier, objectTypeIndexer } from '@babel/types'
//import { generateFreeIdentifier } from '../utils'

addRule('Indexer', () => ({
  ObjectTypeIndexer(path) {
    path.replaceWith(toTs(path.node))
    /*
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
    */
  }
}))
