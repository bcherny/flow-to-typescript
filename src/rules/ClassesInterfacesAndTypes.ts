import {
  classDeclaration,
  DeclareClass,
  DeclareExportDeclaration,
  DeclareFunction,
  DeclareModule,
  DeclareTypeAlias,
  DeclareVariable,
  ExportNamedDeclaration,
  FunctionTypeAnnotation,
  InterfaceDeclaration,
  InterfaceExtends,
  ObjectTypeAnnotation,
  tsInterfaceDeclaration,
  tsTypeAliasDeclaration,
  tsTypeParameter,
  TSTypeParameterDeclaration,
  tsTypeParameterDeclaration,
  TypeAlias,
  variableDeclarator
} from "@babel/types"
import { toTs } from "../nodes"
//import { getValue } from "typeguard"

import { functionToTsType, toTsImplementExtends, toTsTypeParameterInstantiation } from "../nodes/basic-converters"
import { addRule } from "../rule-manager"
import { tsShouldDeclare } from "../utils"

function toTsTypeParameterDeclaration(
  node: FunctionTypeAnnotation | DeclareClass | InterfaceDeclaration | TypeAlias | DeclareTypeAlias
): TSTypeParameterDeclaration | null {
  return node.typeParameters
    ? tsTypeParameterDeclaration(
        node.typeParameters.params.map((param: any) => ({
          ...tsTypeParameter(param.constraint && toTs(param.constraint), param._default && toTs(param._default)),
          name: param.name,
          ...(param.default ? { default: toTs(param.default) } : {})
        }))
      )
    : null
}

function toTSTypeAlias(path: any, isDeclare: boolean) {
  const node = path.node as TypeAlias | DeclareTypeAlias
  path.replaceWith({
    ...tsTypeAliasDeclaration(node.id, toTsTypeParameterDeclaration(node), node.right && (toTs(node.right) as any)),
    declare: isDeclare
  })
}

addRule<
  | DeclareModule
  | DeclareExportDeclaration
  | DeclareFunction
  | DeclareVariable
  | ObjectTypeAnnotation
  | DeclareClass
  | InterfaceDeclaration
  | TypeAlias
  | ExportNamedDeclaration
>("ClassesInterfacesAndTypes | DeclareTypeAlias", () => ({
  ExportNamedDeclaration(path: any) {
    if (path.node.exportKind === "type") {
      delete path.node.exportKind
    }
  },
  DeclareModule(path: any) {
    const newNode = {
      ...path.node,
      type: "TSModuleDeclaration",
      body: {
        ...path.node.body,
        type: "TSModuleBlock"
      },
      declare: true
    }
    delete newNode.kind
    path.replaceWith(newNode)
  },
  DeclareVariable(path: any) {
    path.replaceWith({
      type: "VariableDeclaration",
      declarations: [
        {
          ...path.node,
          ...variableDeclarator(path.node.id)
        }
      ],
      kind: "var",
      declare: tsShouldDeclare(path, false)
    } as any)
  },
  DeclareExportDeclaration(path: any) {
    const node = path.node as DeclareExportDeclaration
    path.replaceWith({
      type: "ExportNamedDeclaration",
      declaration: { ...node.declaration },
      specifiers: []
    } as any)
  },
  ObjectTypeAnnotation(path: any) {
    const node = path.node as ObjectTypeAnnotation
    path.replaceWith(toTs(node))
  },
  DeclareFunction(path: any) {
    const node = path.node as DeclareFunction
    const fn: FunctionTypeAnnotation = (node.id.typeAnnotation as any).typeAnnotation as any
    const fnNode = functionToTsType(fn)
    path.replaceWith({
      ...fnNode,
      id: { ...(node as any).id },
      type: "TSDeclareFunction",
      declare: tsShouldDeclare(path),
      params: fnNode.parameters
    })
  },
  DeclareClass(path: any) {
    const node = path.node as DeclareClass
    const superClazz = node.extends && node.extends.length === 1 ? (node.extends[0] as InterfaceExtends) : null
    path.replaceWith({
      ...classDeclaration(node.id as any, (superClazz ? superClazz.id : null) as any, toTs(node.body) as any, null),
      declare: true,
      ...(superClazz && superClazz.typeParameters
        ? {
            superTypeParameters: toTsTypeParameterInstantiation(superClazz.typeParameters)
          }
        : {}),
      typeParameters: toTsTypeParameterDeclaration(node)
    })
  },
  InterfaceDeclaration(path: any) {
    const node = path.node as InterfaceDeclaration
    const extendz = toTsImplementExtends(node.extends) || ([] as any)
    const op = tsInterfaceDeclaration(node.id as any, toTsTypeParameterDeclaration(node), extendz, toTs(
      node.body
    ) as any)

    if (!extendz || !extendz.length) {
      delete op["extends"]
    }

    path.replaceWith(op)
  },
  TypeAlias(path: any) {
    toTSTypeAlias(path, false)
  },
  DeclareTypeAlias(path: any) {
    toTSTypeAlias(path, true)
  }
}))
