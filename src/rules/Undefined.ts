import { genericTypeAnnotation, identifier } from "@babel/types"

addRule("Undefined", () => ({
  VoidTypeAnnotation(path: any) {
    path.replaceWith(genericTypeAnnotation(identifier("undefined")))
  }
}))
