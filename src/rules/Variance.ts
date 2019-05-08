import { ObjectTypeProperty } from "@babel/types"
import { toTs } from "../nodes"
import { addRule } from "../rule-manager"

addRule<ObjectTypeProperty>("Variance", warnings => ({
  ObjectTypeProperty(path: any) {
    if (path.node.variance && path.node.variance.kind === "plus") {
      warnings.push([
        `Contravariance can"t be expressed in TypeScript`,
        "https://github.com/Microsoft/TypeScript/issues/1394",
        path.node.loc.start.line,
        path.node.loc.start.column
      ])
    }
    path.replaceWith(toTs(path.node))
  }
}))

export {}
