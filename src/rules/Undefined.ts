import { genericTypeAnnotation, identifier } from "@babel/types"
import { addRule } from "../rule-manager"

addRule("Undefined", () => ({
  VoidTypeAnnotation(path: any) {
    path.replaceWith(genericTypeAnnotation(identifier("undefined")))
  }
}))
