import {
  booleanLiteral,
  Flow,
  FlowType,
  FunctionTypeAnnotation,
  identifier,
  Identifier,
  isSpreadProperty,
  isTSTypeParameter,
  isTypeParameter,
  Node,
  numericLiteral,
  stringLiteral,
  tsAnyKeyword,
  tsArrayType,
  tsAsExpression,
  tsBooleanKeyword,
  tsFunctionType,
  TSFunctionType,
  tsIntersectionType,
  tsLiteralType,
  tsNullKeyword,
  tsNumberKeyword,
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
  tsTypeReference,
  tsUndefinedKeyword,
  tsUnionType,
  tsVoidKeyword,
  TypeAnnotation,
  TypeParameter
} from '@babel/types'
import { generateFreeIdentifier } from './utils'

// TODO: Add overloads
export function toTs(node: Flow | TSType): TSType {
  switch (node.type) {
    // TS types
    // TODO: Why does tsTs get called with TSTypes? It should only get called with Flow types.
    case 'TSAnyKeyword':
    case 'TSArrayType':
    case 'TSBooleanKeyword':
    case 'TSConstructorType':
    case 'TSExpressionWithTypeArguments':
    case 'TSFunctionType':
    case 'TSIndexedAccessType':
    case 'TSIntersectionType':
    case 'TSLiteralType':
    case 'TSMappedType':
    case 'TSNeverKeyword':
    case 'TSNullKeyword':
    case 'TSNumberKeyword':
    case 'TSObjectKeyword':
    case 'TSParenthesizedType':
    case 'TSStringKeyword':
    case 'TSSymbolKeyword':
    case 'TSThisType':
    case 'TSTupleType':
    case 'TSTypeAnnotation':
    case 'TSTypeLiteral':
    case 'TSTypeOperator':
    case 'TSTypePredicate':
    case 'TSTypeQuery':
    case 'TSTypeReference':
    case 'TSUndefinedKeyword':
    case 'TSUnionType':
    case 'TSVoidKeyword':
    case 'TSTypeParameterDeclaration':
    case 'TSAsExpression':
    case 'TSPropertySignature':
      return node

    // Flow types
    case 'AnyTypeAnnotation':
    case 'ArrayTypeAnnotation':
    case 'BooleanTypeAnnotation':
    case 'BooleanLiteralTypeAnnotation':
    case 'FunctionTypeAnnotation':
    case 'GenericTypeAnnotation':
    case 'IntersectionTypeAnnotation':
    case 'MixedTypeAnnotation':
    case 'NullableTypeAnnotation':
    case 'NullLiteralTypeAnnotation':
    case 'NumericLiteralTypeAnnotation':
    case 'NumberTypeAnnotation':
    case 'StringLiteralTypeAnnotation':
    case 'StringTypeAnnotation':
    case 'ThisTypeAnnotation':
    case 'TupleTypeAnnotation':
    case 'TypeofTypeAnnotation':
    case 'TypeAnnotation':
    case 'ObjectTypeAnnotation':
    case 'UnionTypeAnnotation':
    case 'VoidTypeAnnotation':
      return toTsType(node)

    case 'ObjectTypeProperty':
      let _ = tsPropertySignature(node.key, tsTypeAnnotation(toTs(node.value)))
      _.optional = node.optional
      _.readonly = node.variance && node.variance.kind === 'minus'
      return _

    case 'TypeCastExpression':
      return tsAsExpression(node.expression, toTs(node.typeAnnotation))

    case 'TypeParameterDeclaration':
      let params = node.params.map(_ => {
        let d = ((_ as any) as TypeParameter).default
        let p = tsTypeParameter(
          hasBound(_) ? toTsType(_.bound.typeAnnotation) : undefined,
          d ? toTs(d) : undefined
        )
        p.name = _.name
        return p
      })

      return tsTypeParameterDeclaration(params)

    case 'ClassImplements':
    case 'ClassProperty':
    case 'DeclareClass':
    case 'DeclareFunction':
    case 'DeclareInterface':
    case 'DeclareModule':
    case 'DeclareTypeAlias':
    case 'DeclareVariable':
    case 'ExistentialTypeParam':
    case 'FunctionTypeParam':
    case 'InterfaceExtends':
    case 'InterfaceDeclaration':
    case 'TypeAlias':
    case 'TypeParameterInstantiation':
    case 'ObjectTypeCallProperty':
    case 'ObjectTypeIndexer':
    case 'QualifiedTypeIdentifier':
      throw 'wut'
  }
}

export function toTsType(node: FlowType): TSType {
  switch (node.type) {
    case 'AnyTypeAnnotation':
      return tsAnyKeyword()
    case 'ArrayTypeAnnotation':
      return tsArrayType(toTsType(node.elementType))
    case 'BooleanTypeAnnotation':
      return tsBooleanKeyword()
    case 'BooleanLiteralTypeAnnotation':
      return tsLiteralType(booleanLiteral(node.value!))
    case 'FunctionTypeAnnotation':
      return functionToTsType(node)
    case 'GenericTypeAnnotation':
      return tsTypeReference(node.id)
    case 'IntersectionTypeAnnotation':
      return tsIntersectionType(node.types.map(toTsType))
    case 'MixedTypeAnnotation':
      return tsAnyKeyword()
    case 'NullLiteralTypeAnnotation':
      return tsNullKeyword()
    case 'NullableTypeAnnotation':
      return tsUnionType([
        toTsType(node.typeAnnotation),
        tsNullKeyword(),
        tsUndefinedKeyword()
      ])
    case 'NumberLiteralTypeAnnotation':
      return tsLiteralType(numericLiteral(node.value!))
    case 'NumberTypeAnnotation':
      return tsNumberKeyword()
    case 'StringLiteralTypeAnnotation':
      return tsLiteralType(stringLiteral(node.value!))
    case 'StringTypeAnnotation':
      return tsStringKeyword()
    case 'ThisTypeAnnotation':
      return tsThisType()
    case 'TupleTypeAnnotation':
      return tsTupleType(node.types.map(toTsType))
    case 'TypeofTypeAnnotation':
      return tsTypeQuery(getId(node.argument))
    case 'ObjectTypeAnnotation':
      return tsTypeLiteral([
        ...node.properties.map(_ => {
          if (isSpreadProperty(_)) {
            return _
          }
          let s = tsPropertySignature(
            _.key,
            tsTypeAnnotation(toTsType(_.value))
          )
          s.optional = _.optional
          return s
          // TODO: anonymous indexers
          // TODO: named indexers
          // TODO: call properties
          // TODO: variance
        })
        // ...node.indexers.map(_ => tSIndexSignature())
      ])
    case 'UnionTypeAnnotation':
      return tsUnionType(node.types.map(toTsType))
    case 'VoidTypeAnnotation':
      return tsVoidKeyword()
  }
}

function getId(node: FlowType): Identifier {
  switch (node.type) {
    case 'GenericTypeAnnotation':
      return node.id
    default:
      throw ReferenceError('typeof query must reference a node that has an id')
  }
}

function functionToTsType(node: FunctionTypeAnnotation): TSFunctionType {
  let typeParams = undefined

  if (node.typeParameters) {
    typeParams = tsTypeParameterDeclaration(
      node.typeParameters.params.map(_ => {
        // TODO: How is this possible?
        if (isTSTypeParameter(_)) {
          return _
        }

        let constraint = _.bound ? toTs(_.bound) : undefined
        let default_ = _.default ? toTs(_.default) : undefined
        let param = tsTypeParameter(constraint, default_)
        param.name = _.name
        return param
      })
    )
  }

  let f = tsFunctionType(typeParams)

  // Params
  if (node.params) {
    // TODO: Rest params
    let paramNames = node.params
      .map(_ => _.name)
      .filter(_ => _ !== null)
      .map(_ => (_ as Identifier).name)
    f.parameters = node.params.map(_ => {
      let name = _.name && _.name.name

      // Generate param name? (Required in TS, optional in Flow)
      if (name == null) {
        name = generateFreeIdentifier(paramNames)
        paramNames.push(name)
      }

      let id = identifier(name)

      if (_.typeAnnotation) {
        id.typeAnnotation = tsTypeAnnotation(toTsType(_.typeAnnotation))
      }

      return id
    })
  }

  // Return type
  if (node.returnType) {
    f.typeAnnotation = tsTypeAnnotation(toTsType(node.returnType))
  }

  return f
}

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}
