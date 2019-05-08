import { objectTypeAnnotation } from "@babel/types"
import { addRule } from "../rule-manager"

addRule("Mixed", () => ({
  MixedTypeAnnotation(path: any) {
    path.replaceWith(objectTypeAnnotation([]))
  }
}))
