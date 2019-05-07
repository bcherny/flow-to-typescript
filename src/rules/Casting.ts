import { toTs } from "../nodes"
import { addRule } from "../rule-manager"

addRule("Casting", () => ({
  TypeCastExpression(path: any) {
    path.replaceWith(toTs(path.node))
  }
}))
