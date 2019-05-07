import { GenericTypeAnnotation } from "@babel/types"

import { genericTypeAnnotationToTS } from "../nodes/basic-converters"
//
// type ConvertVisitor<T extends Node> = {
//   type: T["type"]
//   test: (node: T) => boolean
//   apply: (path: any, node: T) => Node
// }
//
// type ConvertVisitors = ConvertVisitor<GenericTypeAnnotation>
//
// const Converters: ConvertVisitors[] = [
//   {
//     type: "GenericTypeAnnotation",
//     test: node => getValue(() => (node.id as Identifier).name === "$Shape", false),
//     apply: (path, node) => {
//       const newNode = tsTypeReference(
//         {...node.id,name: "Partial"} as any,
//         toTsTypeInstantiation(node.typeParameters),
//
//     }
//
// }
// ]

addRule<GenericTypeAnnotation>("Built-Ins", () => ({
  GenericTypeAnnotation(path: any) {
    let node = path.node as GenericTypeAnnotation

    path.replaceWith(genericTypeAnnotationToTS(node))
  }
}))
