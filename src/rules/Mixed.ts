import { objectTypeAnnotation } from "@babel/types"

addRule("Mixed", () => ({
  MixedTypeAnnotation(path: any) {
    path.replaceWith(objectTypeAnnotation([]))
  }
}))
