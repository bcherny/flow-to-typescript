import { tsParenthesizedType } from "@babel/types"
import { toTs } from "../nodes"
import { addRule } from "../rule-manager"

addRule("Functions", () => ({
  FunctionTypeAnnotation(path: any) {
    let node = toTs(path.node)!!
    if (["UnionTypeAnnotation", "IntersectionTypeAnnotation"].some(type => type === path.parent.type))
      node = tsParenthesizedType(node)

    path.replaceWith(node)
  }
}))
