import { GenericTypeAnnotation } from "@babel/types"

import { genericTypeAnnotationToTS } from "../nodes"
import { addRule } from "../rule-manager"

addRule<GenericTypeAnnotation>("Built-Ins", () => ({
  GenericTypeAnnotation(path: any) {
    let node = path.node as GenericTypeAnnotation

    path.replaceWith(genericTypeAnnotationToTS(node))
  }
}))
