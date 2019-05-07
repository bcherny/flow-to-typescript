import {
  booleanLiteral,
  Flow as DefaultFlow,
  FlowType,
  isSpreadElement,
  numericLiteral,
  ObjectTypeAnnotation,
  ObjectTypeProperty,
  stringLiteral,
  tsAnyKeyword,
  tsArrayType,
  tsAsExpression,
  tsBooleanKeyword,
  tsIntersectionType,
  tsLiteralType,
  tsNullKeyword,
  tsNumberKeyword,
  tsParenthesizedType,
  tsPropertySignature,
  tsStringKeyword,
  tsThisType,
  tsTupleType,
  TSType,
  tsTypeAnnotation,
  tsTypeLiteral,
  tsTypeParameter,
  tsTypeParameterDeclaration,
  tsTypeQuery,
  tsUndefinedKeyword,
  tsUnionType,
  tsVoidKeyword,
  TypeCastExpression,
  TypeParameter,
  TypeParameterDeclaration
} from "@babel/types"
import { getValue } from "typeguard"
import { functionToTsType, genericTypeAnnotationToTS, toTsIndexer } from "./basic-converters"
import { getId, hasBound, isObjectTypeProperty } from "../utils"

export type Flow = DefaultFlow // | NumericLiteralTypeAnnotation

// TODO: Add overloads
function toTsGlobal(node: Flow | TSType | null): TSType | null {
  if (!node || !node.type) return null
  const { type } = node

  switch (type) {
    // TS types
    // TODO: Why does tsTs get called with TSTypes? It should only get called with Flow types.
    case "TSAnyKeyword":
    case "TSArrayType":
    case "TSBooleanKeyword":
    case "TSConstructorType":
    case "TSExpressionWithTypeArguments":
    case "TSFunctionType":
    case "TSIndexedAccessType":
    case "TSIntersectionType":
    case "TSLiteralType":
    case "TSMappedType":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSParenthesizedType":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSThisType":
    case "TSTupleType":
    case "TSTypeAnnotation" as any:
    case "TSTypeLiteral":
    case "TSTypeOperator":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeReference":
    case "TSUndefinedKeyword":
    case "TSUnionType":
    case "TSVoidKeyword":
    case "TSTypeParameterDeclaration" as any:
    case "TSAsExpression" as any:
    case "TSPropertySignature" as any:
      return node as TSType

    // Flow types
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "NumericLiteralTypeAnnotation" as any:
    case "NumberTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "TypeAnnotation":
    case "ObjectTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
      return toTsType(node as any)!!

    case "ObjectTypeProperty":
      const propNode = node as ObjectTypeProperty
      let _ = tsPropertySignature(propNode.key, tsTypeAnnotation(toTs(propNode.value as any)!!))
      _.optional = propNode.optional
      _.readonly = propNode.variance && propNode.variance.kind === "minus"
      return _ as any

    case "TypeCastExpression":
      const cast = node as TypeCastExpression
      return tsAsExpression(cast.expression, toTs(cast.typeAnnotation) as TSType) as any

    case "TypeParameterDeclaration":
      const paramDecl = node as TypeParameterDeclaration
      let params = paramDecl.params.map(_ => {
        let d = ((_ as any) as TypeParameter).default
        let p = tsTypeParameter(hasBound(_) ? toTsType(_.bound.typeAnnotation) : undefined, d ? toTs(d) : undefined)
        p.name = _.name
        return p
      })

      return tsTypeParameterDeclaration(params) as any

    case "InterfaceExtends":
    // const nodeExtends = node as InterfaceExtends
    // return tsInterface
    case "ClassImplements":
    case "ClassProperty" as any:
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareTypeAlias":
    case "DeclareVariable":
    case "ExistentialTypeParam" as any:
    case "FunctionTypeParam":

    case "InterfaceDeclaration":
    case "TypeAlias":
    case "TypeParameterInstantiation":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "QualifiedTypeIdentifier":
      throw "wut"
  }

  throw "wtf"
}

function toTsTypeGlobal(node: any & FlowType): TSType | null {
  // node = (node as any).type === "TypeAnnotation" ? toTsType(node.typeAnnotation) : node
  switch (node.type) {
    case "TypeAnnotation":
      return toTsType(node.typeAnnotation)
    case "AnyTypeAnnotation":
      return tsAnyKeyword()
    case "ArrayTypeAnnotation":
      return tsArrayType(toTsType(node.elementType)!!)
    case "BooleanTypeAnnotation":
      return tsBooleanKeyword()
    case "BooleanLiteralTypeAnnotation":
      return tsLiteralType(booleanLiteral(node.value!))
    case "FunctionTypeAnnotation":
      return functionToTsType(node)
    case "GenericTypeAnnotation":
      return genericTypeAnnotationToTS(node as any)
    case "IntersectionTypeAnnotation":
      return tsIntersectionType(
        node.types.map((type: any) => {
          let tsType = toTsType(type) as any
          if (type.type === "FunctionTypeAnnotation" && tsType.typeAnnotation) {
            tsType = tsParenthesizedType(tsType)
          }
          return tsType
        })
      )
    // node.types.map(toTsType))
    case "ExistsTypeAnnotation":
    case "MixedTypeAnnotation":
      return tsAnyKeyword()
    case "NullLiteralTypeAnnotation":
      return tsNullKeyword()
    case "NullableTypeAnnotation":
      return tsUnionType([toTsType(node.typeAnnotation)!!, tsNullKeyword(), tsUndefinedKeyword()])
    case "NumberLiteralTypeAnnotation":
      return tsLiteralType(numericLiteral(node.value!))
    case "NumberTypeAnnotation":
      return tsNumberKeyword()
    case "StringLiteralTypeAnnotation":
      return tsLiteralType(stringLiteral(node.value!))
    case "StringTypeAnnotation":
      return tsStringKeyword()
    case "ThisTypeAnnotation":
      return tsThisType()
    case "TupleTypeAnnotation":
      return tsTupleType(node.types.map(toTsType))
    case "TypeofTypeAnnotation":
      return tsTypeQuery(getId(node.argument))
    case "ObjectTypeAnnotation":
      const typeAnno = node as ObjectTypeAnnotation
      return tsTypeLiteral([
        ...(typeAnno.properties.filter(isObjectTypeProperty).map(_ => {
          if (isSpreadElement(_)) {
            return _
          }
          const s = tsPropertySignature(_.key, tsTypeAnnotation(toTsType(_.value)!!))
          s.optional = _.optional
          s.readonly = getValue(() => (_ as any).variance.kind === "minus", false)
          return s
          // TODO: anonymous indexers
          // TODO: named indexers
          // TODO: call properties
          // TODO: variance
        }) as any),
        ...(!typeAnno.indexers ? [] : typeAnno.indexers.map(indexer => toTsIndexer(indexer)))
      ]) as any
    case "UnionTypeAnnotation":
      return tsUnionType(
        node.types.map((type: any) => {
          let tsType = toTsType(type) as any
          if (type.type === "FunctionTypeAnnotation" && tsType.typeAnnotation) {
            tsType = tsParenthesizedType(tsType)
          }
          return tsType
        })
      )
    case "VoidTypeAnnotation":
      return tsVoidKeyword()
  }

  if (node.type && node.type.startsWith("TS")) return node
  else throw "wtf"
}

declare global {
  const toTs: typeof toTsGlobal
  const toTsType: typeof toTsTypeGlobal
}

Object.assign(global, {
  toTs: toTsGlobal,
  toTsType: toTsTypeGlobal
})

export {}
