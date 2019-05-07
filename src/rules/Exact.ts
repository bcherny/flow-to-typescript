import { objectTypeAnnotation, ObjectTypeAnnotation } from "@babel/types"
import { addRule } from "../rule-manager"

addRule<ObjectTypeAnnotation>("Exact", warnings => ({
  ObjectTypeAnnotation(path: any) {
    const node = path.node as ObjectTypeAnnotation
    if (node.exact || !node.exact) {
      warnings.push([
        `Exact types can"t be expressed in TypeScript`,
        "https://github.com/Microsoft/TypeScript/issues/12936",
        path.node.loc.start.line,
        path.node.loc.start.column
      ])

      objectTypeAnnotation(path.node.properties, path.node.indexers, path.node.callProperties)
    }
  }
}))
