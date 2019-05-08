import {
  FlowType,
  GenericTypeAnnotation,
  Identifier,
  isTypeParameter,
  Node,
  ObjectTypeProperty,
  TSType,
  TSTypeReference,
  TypeAnnotation,
  TypeParameter
} from "@babel/types"
import { getValue } from "typeguard"

const candidates = "abcdefghijklmnopqrstuvwxyz".split("")

export function generateFreeIdentifier(usedIdentifiers: string[]) {
  return candidates.find(_ => usedIdentifiers.indexOf(_) < 0)!
}

export function isObjectTypeProperty(o: any): o is ObjectTypeProperty {
  return o.type === "ObjectTypeProperty"
}

export function tsShouldDeclare(path: any, defaultDeclare: boolean = true): boolean {
  return ["TSModuleDeclaration", "ExportNamedDeclaration"].every(container =>
    getValue(() => !path.parentPath.container.type.includes(container), defaultDeclare)
  )
}

export function getId(node: FlowType | TSType): Identifier {
  switch (node.type) {
    case "TSTypeReference":
      return (node as TSTypeReference).typeName as Identifier
    case "GenericTypeAnnotation":
      return (node as GenericTypeAnnotation).id as Identifier
    default:
      throw ReferenceError("typeof query must reference a node that has an id")
  }
}

export interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}

export function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}
