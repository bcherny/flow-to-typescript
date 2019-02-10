import {
  booleanLiteral,
  Flow,
  FlowType,
  FunctionTypeAnnotation,
  identifier,
  Identifier,
  isObjectTypeSpreadProperty,
  isQualifiedTypeIdentifier,
  isTSTypeParameter,
  numericLiteral,
  stringLiteral,
  tsAnyKeyword,
  tsArrayType,
  tsBooleanKeyword,
  TSFunctionType,
  tsFunctionType,
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
  tsVoidKeyword
} from '@babel/types'
import * as t from '@babel/types'
import { generateFreeIdentifier } from './utils'

// TODO: Add overloads
export function toTS(node: Flow): TSType {
  switch (node.type) {
    case 'AnyTypeAnnotation':
      return tsAnyKeyword()
    case 'ArrayTypeAnnotation':
      return tsArrayType(toTS(node.elementType))
    case 'BooleanTypeAnnotation':
      return tsBooleanKeyword()
    case 'BooleanLiteralTypeAnnotation':
      return tsLiteralType(booleanLiteral(node.value!))
    case 'NullLiteralTypeAnnotation':
      return tsNullKeyword()
    case 'ExistsTypeAnnotation':
      throw `${node.type} is not yet supported. 🙏 Pull request?`
    case 'FunctionTypeAnnotation':
      return functionToTS(node)
    case 'GenericTypeAnnotation':
      if (isQualifiedTypeIdentifier(node.id)) {
        throw `${node.type} is not yet supported. 🙏 Pull request?`
      }
      return tsTypeReference(node.id)
    case 'InterfaceTypeAnnotation':
      throw `${node.type} is not yet supported. 🙏 Pull request?`
    case 'IntersectionTypeAnnotation':
      return tsIntersectionType(node.types.map(toTS))
    case 'MixedTypeAnnotation':
      return t.tsUnknownKeyword()
    case 'EmptyTypeAnnotation':
      return t.tsNeverKeyword()
    case 'NullableTypeAnnotation':
      return tsUnionType([
        toTS(node.typeAnnotation),
        tsNullKeyword(),
        tsUndefinedKeyword()
      ])
    case 'NumberLiteralTypeAnnotation':
      return tsLiteralType(numericLiteral(node.value!))
    case 'NumberTypeAnnotation':
      return tsNumberKeyword()
    case 'ObjectTypeAnnotation':
      return tsTypeLiteral([
        ...node.properties.map(_ => {
          if (isObjectTypeSpreadProperty(_)) {
            throw `${_.type} is not yet supported. 🙏 Pull request?`
          }
          let s = tsPropertySignature(
            _.key,
            tsTypeAnnotation(toTS(_.value))
          )
          s.optional = _.optional
          s.readonly = _.variance && _.variance.kind === 'minus'
          return s
          // TODO: anonymous indexers
          // TODO: named indexers
          // TODO: call properties
          // TODO: variance
        })
        // ...node.indexers.map(_ => tSIndexSignature())
      ])
    case 'StringLiteralTypeAnnotation':
      return tsLiteralType(stringLiteral(node.value!))
    case 'StringTypeAnnotation':
      return tsStringKeyword()
    case 'ThisTypeAnnotation':
      return tsThisType()
    case 'TupleTypeAnnotation':
      return tsTupleType(node.types.map(toTS))
    case 'TypeofTypeAnnotation':
      return tsTypeQuery(getID(node.argument))
    case 'UnionTypeAnnotation':
      return tsUnionType(node.types.map(toTS))
    case 'VoidTypeAnnotation':
      return tsVoidKeyword()

    default:
      throw `${node.type} is not yet supported. 🙏 Pull request?`

    // case 'TypeCastExpression':
    //   return tsAsExpression(node.expression, toTS(node.typeAnnotation))

    // case 'TypeParameterDeclaration':
    //   let params = node.params.map(_ => {
    //     let p = tsTypeParameter(
    //       hasBound(_) ? toTS(_.bound.typeAnnotation) : undefined,
    //       _.default ? toTS(_.default) : undefined
    //     )
    //     p.name = _.name
    //     return p
    //   })

      // return tsTypeParameterDeclaration(params)

    // case 'ClassImplements':
    // case 'DeclareClass':
    // case 'DeclareFunction':
    // case 'DeclareInterface':
    // case 'DeclareModule':
    // case 'DeclareTypeAlias':
    // case 'DeclareVariable':
    // case 'ExistsTypeAnnotation':
    // case 'FunctionTypeParam':
    // case 'InterfaceExtends':
    // case 'InterfaceDeclaration':
    // case 'TypeAlias':
    // case 'TypeParameterInstantiation':
    // case 'ObjectTypeCallProperty':
    // case 'ObjectTypeIndexer':
    // case 'QualifiedTypeIdentifier':
    //   throw 'wut'
  }
}

function getID(node: FlowType): Identifier {
  switch (node.type) {
    case 'GenericTypeAnnotation':
      if (!t.isIdentifier(node.id)) {
        throw 'Not an identifier'
      }
      return node.id
    default:
      throw ReferenceError('typeof query must reference a node that has an id')
  }
}

function functionToTS(node: FunctionTypeAnnotation): TSFunctionType {
  let typeParams = undefined

  if (node.typeParameters) {
    typeParams = tsTypeParameterDeclaration(
      node.typeParameters.params.map(_ => {
        // TODO: How is this possible?
        if (isTSTypeParameter(_)) {
          return _
        }

        let constraint = _.bound ? toTS(_.bound.typeAnnotation) : undefined
        let default_ = _.default ? toTS(_.default) : undefined
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
        id.typeAnnotation = tsTypeAnnotation(toTS(_.typeAnnotation))
      }

      return id
    })
  }

  // Return type
  if (node.returnType) {
    f.typeAnnotation = tsTypeAnnotation(toTS(node.returnType))
  }

  return f
}
