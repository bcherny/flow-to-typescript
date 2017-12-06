import { booleanLiteral, Flow, FlowTypeAnnotation, FunctionTypeAnnotation, Identifier, identifier, numericLiteral, stringLiteral, tSAnyKeyword, tSArrayType, tSBooleanKeyword, tSExpressionWithTypeArguments, tSFunctionType, TSFunctionType, tSIntersectionType, tSLiteralType, tSNullKeyword, tSNumberKeyword, tSPropertySignature, tSStringKeyword, tSThisType, tSTupleType, TSType, tSTypeAnnotation, tSTypeLiteral, tSTypeQuery, tSTypeReference, tSUndefinedKeyword, tSUnionType, tSVoidKeyword } from 'babel/packages/babel-types/lib'
import { generateFreeIdentifier } from './utils'

// TODO: Add overloads
export function toTs(node: Flow): TSType {
  switch (node.type) {
    case 'AnyTypeAnnotation':
    case 'ArrayTypeAnnotation':
    case 'BooleanTypeAnnotation':
    case 'BooleanLiteralTypeAnnotation':
    case 'FunctionTypeAnnotation':
    case 'GenericTypeAnnotation':
    case 'IntersectionTypeAnnotation':
    case 'MixedTypeAnnotation':
    case 'NullableTypeAnnotation':
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

    case 'ClassImplements': return tSExpressionWithTypeArguments(
      node.id,
      node.typeParameters ? toTs(node.typeParameters) : undefined
    )
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
    case 'TypeCastExpression':
    case 'TypeParameterDeclaration':
    case 'TypeParameterInstantiation':
    case 'ObjectTypeCallProperty':
    case 'ObjectTypeIndexer':
    case 'ObjectTypeProperty':
    case 'QualifiedTypeIdentifier':
  }
}

export function toTsType(node: FlowTypeAnnotation): TSType {
  switch (node.type) {
    case 'AnyTypeAnnotation': return tSAnyKeyword()
    case 'ArrayTypeAnnotation': return tSArrayType(toTsType(node.elementType))
    case 'BooleanTypeAnnotation': return tSBooleanKeyword()
    case 'BooleanLiteralTypeAnnotation': return tSLiteralType(booleanLiteral(node.value))
    case 'FunctionTypeAnnotation': return functionToTsType(node)
    case 'GenericTypeAnnotation': return tSTypeReference(node.id)
    case 'IntersectionTypeAnnotation': return tSIntersectionType(node.types.map(toTsType))
    case 'MixedTypeAnnotation': return tSAnyKeyword()
    case 'NullableTypeAnnotation': return tSUnionType([toTsType(node.typeAnnotation), tSNullKeyword(), tSUndefinedKeyword()])
    case 'NumericLiteralTypeAnnotation': return tSLiteralType(numericLiteral(node.value))
    case 'NumberTypeAnnotation': return tSNumberKeyword()
    case 'StringLiteralTypeAnnotation': return tSLiteralType(stringLiteral(node.value))
    case 'StringTypeAnnotation': return tSStringKeyword()
    case 'ThisTypeAnnotation': return tSThisType()
    case 'TupleTypeAnnotation': return tSTupleType(node.types.map(toTsType))
    case 'TypeofTypeAnnotation': return tSTypeQuery(getId(node.argument))
    case 'TypeAnnotation': return toTsType(node.typeAnnotation)
    case 'ObjectTypeAnnotation': return tSTypeLiteral([
      ...node.properties.map(_ => {
      let s = tSPropertySignature(_.key, tSTypeAnnotation(toTsType(_.value)))
      s.optional = _.optional
      return s
      // TODO: anonymous indexers
      // TODO: named indexers
      // TODO: call properties
      // TODO: variance
      })
      // ...node.indexers.map(_ => tSIndexSignature())
    ])
    case 'UnionTypeAnnotation': return tSUnionType(node.types.map(toTsType))
    case 'VoidTypeAnnotation': return tSVoidKeyword()
  }
}

function getId(node: FlowTypeAnnotation): Identifier {
  switch (node.type) {
    case 'GenericTypeAnnotation': return node.id
    default: throw ReferenceError('typeof query must reference a node that has an id')
  }
}

function functionToTsType(node: FunctionTypeAnnotation): TSFunctionType {

  // TODO: Type bounds, defaults
  let f = tSFunctionType(node.typeParameters)

  // Params
  // TODO: Rest params
  let paramNames = node.params.map(_ => _.name).filter(_ => _ !== null).map(_ => _.name)
  f.parameters = node.params.map(_ => {
    let name = _.name.name

    // Generate param name? (Required in TS, optional in Flow)
    if (name == null) {
      name = generateFreeIdentifier(paramNames)
      paramNames.push(name)
    }

    let id = identifier(_.name.name || name)
    // id.type = toTsType(_.typeAnnotation) // TODO

    return id
  })

  // Return type
  f.typeAnnotation = tSTypeAnnotation(toTsType(node.returnType))

  return f
}
