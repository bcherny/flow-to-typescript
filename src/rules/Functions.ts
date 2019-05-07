import { toTs } from "../nodes"
import { addRule } from "../rule-manager"

addRule("Functions", () => ({
  FunctionTypeAnnotation(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
