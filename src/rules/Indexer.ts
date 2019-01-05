import { addRule } from '../'
import { toTs } from '../convert'

addRule('Indexer', () => ({
  ObjectTypeIndexer(path) {
    path.replaceWith(toTs(path.node))
  }
}))
