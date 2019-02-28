import { addRule } from '../'
import { toTs } from '../convert'

addRule('Indexer', (warnings) => ({
  ObjectTypeIndexer(path) {
    path.replaceWith(toTs(path.node, warnings))
  }
}))
