import { booleanLiteral, File, Flow, FlowTypeAnnotation, FunctionTypeAnnotation, identifier, Identifier, isTSTypeParameter, isTypeParameter, LVal, Node, numericLiteral, Statement, stringLiteral, tsAnyKeyword, tsArrayType, tsAsExpression, tsBooleanKeyword, tsFunctionType, TsFunctionType, tsIntersectionType, tsLiteralType, tsNullKeyword, tsNumberKeyword, tsPropertySignature, tsStringKeyword, tsThisType, tsTupleType, TsType, tsTypeAnnotation, tsTypeLiteral, tsTypeParameter, tsTypeParameterDeclaration, tsTypeQuery, tsTypeReference, tsUndefinedKeyword, tsUnionType, tsVoidKeyword, TypeAnnotation, TypeParameter, VariableDeclarator } from '@babel/types'
import * as t from '@babel/types'
import { generateFreeIdentifier } from './utils'

export function convert(f: File): File {
  return ts(f)
}

type AnyNode = AnyNonFlowNode | Flow
type AnyNonFlowNode = LVal | Statement | t.Declaration | TSType | VariableDeclarator
  | t.Expression | t.Literal
  | t.File | t.Program | null | undefined

// LVals
function ts(node: t.Identifier): t.Identifier
function ts(node: t.MemberExpression): t.MemberExpression
function ts(node: t.RestElement): t.RestElement
function ts(node: t.AssignmentPattern): t.AssignmentPattern
function ts(node: t.ArrayPattern): t.ArrayPattern
function ts(node: t.ObjectPattern): t.ObjectPattern
function ts(node: t.TSParameterProperty): t.TSParameterProperty
function ts(node: t.LVal): t.LVal

// Statements
function ts(node: t.BlockStatement): t.BlockStatement
function ts(node: t.BreakStatement): t.BreakStatement
function ts(node: t.ContinueStatement): t.ContinueStatement
function ts(node: t.DebuggerStatement): t.DebuggerStatement
function ts(node: t.DoWhileStatement): t.DoWhileStatement
function ts(node: t.EmptyStatement): t.EmptyStatement
function ts(node: t.ExpressionStatement): t.ExpressionStatement
function ts(node: t.ForInStatement): t.ForInStatement
function ts(node: t.ForStatement): t.ForStatement
function ts(node: t.FunctionDeclaration): t.FunctionDeclaration
function ts(node: t.IfStatement): t.IfStatement
function ts(node: t.LabeledStatement): t.LabeledStatement
function ts(node: t.ReturnStatement): t.ReturnStatement
function ts(node: t.SwitchStatement): t.SwitchStatement
function ts(node: t.ThrowStatement): t.ThrowStatement
function ts(node: t.TryStatement): t.TryStatement
function ts(node: t.VariableDeclaration): t.VariableDeclaration
function ts(node: t.WhileStatement): t.WhileStatement
function ts(node: t.WithStatement): t.WithStatement
function ts(node: t.ClassDeclaration): t.ClassDeclaration
function ts(node: t.ExportAllDeclaration): t.ExportAllDeclaration
function ts(node: t.ExportDefaultDeclaration): t.ExportDefaultDeclaration
function ts(node: t.ExportNamedDeclaration): t.ExportNamedDeclaration
function ts(node: t.ForOfStatement): t.ForOfStatement
function ts(node: t.ImportDeclaration): t.ImportDeclaration
function ts(node: t.Statement): t.Statement

// Statements (Flow)
function ts(node: t.DeclareClass): t.DeclareClass
function ts(node: t.DeclareFunction): t.TSDeclareFunction
function ts(node: t.DeclareInterface): t.DeclareInterface
function ts(node: t.DeclareModule): t.DeclareModule
function ts(node: t.DeclareTypeAlias): t.DeclareTypeAlias
function ts(node: t.DeclareVariable): t.DeclareVariable
function ts(node: t.InterfaceDeclaration): t.TSInterfaceDeclaration
function ts(node: t.TypeAlias): t.TypeAlias

// Statements (TS)
function ts(node: t.TSDeclareFunction): t.TSDeclareFunction
function ts(node: t.TSEnumDeclaration): t.TSEnumDeclaration
function ts(node: t.TSExportAssignment): t.TSExportAssignment
function ts(node: t.TSImportEqualsDeclaration): t.TSImportEqualsDeclaration
function ts(node: t.TSInterfaceDeclaration): t.TSInterfaceDeclaration
function ts(node: t.TSModuleDeclaration): t.TSModuleDeclaration
function ts(node: t.TSNamespaceExportDeclaration): t.TSNamespaceExportDeclaration
function ts(node: t.TSTypeAliasDeclaration): t.TSTypeAliasDeclaration

// Declarations
function ts(node: t.FunctionDeclaration): t.FunctionDeclaration
function ts(node: t.VariableDeclaration): t.VariableDeclaration
function ts(node: t.ClassDeclaration): t.ClassDeclaration
function ts(node: t.ExportAllDeclaration): t.ExportAllDeclaration
function ts(node: t.ExportDefaultDeclaration): t.ExportDefaultDeclaration
function ts(node: t.ExportNamedDeclaration): t.ExportNamedDeclaration
function ts(node: t.ImportDeclaration): t.ImportDeclaration
function ts(node: t.DeclareClass): t.DeclareClass
function ts(node: t.DeclareFunction): t.DeclareFunction
function ts(node: t.DeclareInterface): t.DeclareInterface
function ts(node: t.DeclareModule): t.DeclareModule
function ts(node: t.DeclareTypeAlias): t.DeclareTypeAlias
function ts(node: t.DeclareVariable): t.DeclareVariable
function ts(node: t.InterfaceDeclaration): t.InterfaceDeclaration
function ts(node: t.TypeAlias): t.TypeAlias
function ts(node: t.TSDeclareFunction): t.TSDeclareFunction
function ts(node: t.TSEnumDeclaration): t.TSEnumDeclaration
function ts(node: t.TSInterfaceDeclaration): t.TSInterfaceDeclaration
function ts(node: t.TSModuleDeclaration): t.TSModuleDeclaration
function ts(node: t.TSTypeAliasDeclaration): t.TSTypeAliasDeclaration

// Expressions
function ts(node: t.ArrayExpression): t.ArrayExpression
function ts(node: t.AssignmentExpression): t.AssignmentExpression
function ts(node: t.BinaryExpression): t.BinaryExpression
function ts(node: t.CallExpression): t.CallExpression
function ts(node: t.ConditionalExpression): t.ConditionalExpression
function ts(node: t.FunctionExpression): t.FunctionExpression
function ts(node: t.Identifier): t.Identifier
function ts(node: t.StringLiteral): t.StringLiteral
function ts(node: t.NumericLiteral): t.NumericLiteral
function ts(node: t.BooleanLiteral): t.BooleanLiteral
function ts(node: t.NullLiteral): t.NullLiteral
function ts(node: t.RegExpLiteral): t.RegExpLiteral
function ts(node: t.LogicalExpression): t.LogicalExpression
function ts(node: t.MemberExpression): t.MemberExpression
function ts(node: t.NewExpression): t.NewExpression
function ts(node: t.ObjectExpression): t.ObjectExpression
function ts(node: t.SequenceExpression): t.SequenceExpression
function ts(node: t.ThisExpression): t.ThisExpression
function ts(node: t.UnaryExpression): t.UnaryExpression
function ts(node: t.UpdateExpression): t.UpdateExpression
function ts(node: t.ArrowFunctionExpression): t.ArrowFunctionExpression
function ts(node: t.ClassExpression): t.ClassExpression
function ts(node: t.MetaProperty): t.MetaProperty
function ts(node: t.Super): t.Super
function ts(node: t.TaggedTemplateExpression): t.TaggedTemplateExpression
function ts(node: t.TemplateLiteral): t.TemplateLiteral
function ts(node: t.YieldExpression): t.YieldExpression
function ts(node: t.TypeCastExpression): t.TypeCastExpression
function ts(node: t.JSXElement): t.JSXElement
function ts(node: t.JSXEmptyExpression): t.JSXEmptyExpression
function ts(node: t.JSXIdentifier): t.JSXIdentifier
function ts(node: t.JSXMemberExpression): t.JSXMemberExpression
function ts(node: t.ParenthesizedExpression): t.ParenthesizedExpression
function ts(node: t.AwaitExpression): t.AwaitExpression
function ts(node: t.BindExpression): t.BindExpression
function ts(node: t.DoExpression): t.DoExpression
function ts(node: t.TSAsExpression): t.TSAsExpression
function ts(node: t.TSNonNullExpression): t.TSNonNullExpression
function ts(node: t.TSTypeAssertion): t.TSTypeAssertion

// Literals
function ts(node: t.StringLiteral): t.StringLiteral
function ts(node: t.NumericLiteral): t.NumericLiteral
function ts(node: t.BooleanLiteral): t.BooleanLiteral
function ts(node: t.NullLiteral): t.NullLiteral
function ts(node: t.RegExpLiteral): t.RegExpLiteral
function ts(node: t.TemplateLiteral): t.TemplateLiteral

// Flow types
function ts(node: t.AnyTypeAnnotation): t.TSAnyKeyword
function ts(node: t.ArrayTypeAnnotation): t.TSArrayType
function ts(node: t.BooleanTypeAnnotation): t.TSBooleanKeyword
function ts(node: t.BooleanLiteralTypeAnnotation): t.TSLiteralType
function ts(node: t.ClassImplements): t.ClassImplements
function ts(node: t.ClassProperty): t.ClassProperty
function ts(node: t.DeclareClass): t.DeclareClass
function ts(node: t.DeclareFunction): t.TSDeclareFunction
function ts(node: t.DeclareInterface): t.DeclareInterface
function ts(node: t.DeclareModule): t.DeclareModule
function ts(node: t.DeclareTypeAlias): t.DeclareTypeAlias
function ts(node: t.DeclareVariable): t.DeclareVariable
function ts(node: t.ExistentialTypeParam): never
function ts(node: t.FunctionTypeAnnotation): t.TSFunctionType
function ts(node: t.FunctionTypeParam): t.FunctionTypeParam // TODO
function ts(node: t.GenericTypeAnnotation): t.GenericTypeAnnotation // TODO
function ts(node: t.InterfaceExtends): t.InterfaceExtends
function ts(node: t.InterfaceDeclaration): t.InterfaceDeclaration
function ts(node: t.IntersectionTypeAnnotation): t.IntersectionTypeAnnotation
function ts(node: t.MixedTypeAnnotation): t.TSAnyKeyword
function ts(node: t.NullableTypeAnnotation): t.TSUnionType
function ts(node: t.NullLiteralTypeAnnotation): t.TSNullKeyword
function ts(node: t.NumericLiteralTypeAnnotation): t.TSLiteralType
function ts(node: t.NumberTypeAnnotation): t.TSNumberKeyword
function ts(node: t.StringLiteralTypeAnnotation): t.TSLiteralType
function ts(node: t.StringTypeAnnotation): t.TSStringKeyword
function ts(node: t.ThisTypeAnnotation): t.TSThisType
function ts(node: t.TupleTypeAnnotation): t.TSTupleType
function ts(node: t.TypeofTypeAnnotation): t.TSTypeOperator
function ts(node: t.TypeAlias): t.TypeAlias
function ts(node: t.TypeAnnotation): t.TSTypeAnnotation
function ts(node: t.TypeCastExpression): t.TSAsExpression
function ts(node: t.TypeParameterDeclaration): t.TSTypeParameterDeclaration
function ts(node: t.TypeParameterInstantiation): t.TSTypeParameterInstantiation
function ts(node: t.ObjectTypeAnnotation): t.TSObjectKeyword
function ts(node: t.ObjectTypeCallProperty): t.ObjectTypeCallProperty // TODO
function ts(node: t.ObjectTypeIndexer): t.ObjectTypeIndexer
function ts(node: t.ObjectTypeProperty): t.ObjectTypeProperty
function ts(node: t.QualifiedTypeIdentifier): t.QualifiedTypeIdentifier
function ts(node: t.UnionTypeAnnotation): t.TSUnionType
function ts(node: t.VoidTypeAnnotation): t.TSVoidKeyword

// Other
function ts(node: t.File): t.File
function ts(node: t.Program): t.Program
function ts(node: null): null
function ts(node: undefined): undefined

function ts(node: AnyNode): AnyNonFlowNode {

  if (!node) {
    return node
  }

  switch (node.type) {

    case 'File': return t.file(ts(node.program), node.comments, node.tokens)
    case 'Program': return t.program(node.body.map(ts), node.directives)

    // Statements
    case 'VariableDeclaration': return t.variableDeclaration(node.kind, node.declarations.map(ts))
    case 'VariableDeclarator': return t.variableDeclarator(ts(node.id), node.init)
    case 'BlockStatement': return t.blockStatement(node.body.map(ts), map(node.directives, ts))
    case 'DoWhileStatement': return t.doWhileStatement(ts(node.test), ts(node.block))
    case 'ExpressionStatement': return t.expressionStatement(ts(node.expression))
    case 'ForInStatement': return t.forInStatement(ts(node.left), ts(node.right), ts(node.body))
    case 'ForStatement': return t.forStatement(ts(node.init), ts(node.test), ts(node.update), ts(node.body))
    case 'FunctionDeclaration': return t.functionDeclaration(ts(node.id), map(node.params, ts), ts(node.body), node.generator, node.async)
    case 'IfStatement': return t.ifStatement(ts(node.test), ts(node.consequent), ts(node.alternate))
    case 'LabeledStatement': return t.labeledStatement(ts(node.label))
    case 'ReturnStatement': return t.returnStatement(ts(node.argument))
    case 'SwitchStatement': return t.switchStatement(ts(node.discriminant), map(node.cases, ts))
    case 'ThrowStatement': return t.throwStatement(ts(node.argument))
    case 'TryStatement': return t.tryStatement(ts(node.block), ts(node.handler), ts(node.finalizer))
    case 'WhileStatement': return t.whileStatement(ts(node.test), ts(node.body))
    case 'WithStatement': return t.withStatement(ts(node.object), ts(node.body))
    case 'ClassDeclaration': return t.classDeclaration(ts(node.id), ts(node.superClass), ts(node.body), map(node.decorators, ts))
    case 'ExportAllDeclaration': return t.exportAllDeclaration(ts(node.source))
    case 'ExportDefaultDeclaration': return t.exportDefaultDeclaration(ts(node.declaration))
    case 'ExportNamedDeclaration': return t.exportNamedDeclaration(ts(node.declaration), map(node.specifiers, ts), ts(node.source))
    case 'ForOfStatement': return t.forOfStatement(ts(node.left), ts(node.right), ts(node.body))
    case 'ImportDeclaration': return t.importDeclaration(map(node.specifiers, ts), ts(node.source))
    case 'BreakStatement':
    case 'ContinueStatement':
    case 'DebuggerStatement':
    case 'EmptyStatement':
      return node

    case 'TSDeclareFunction':
    case 'TSEnumDeclaration':
    case 'TSExportAssignment':
    case 'TSImportEqualsDeclaration':
    case 'TSInterfaceDeclaration':
    case 'TSModuleDeclaration':
    case 'TSNamespaceExportDeclaration':
    case 'TSTypeAliasDeclaration':
      return node

    // Flow types
    case 'AnyTypeAnnotation': return tSAnyKeyword()
    case 'ArrayTypeAnnotation': return tSArrayType(ts(node.elementType))
    case 'BooleanTypeAnnotation': return tSBooleanKeyword()
    case 'BooleanLiteralTypeAnnotation': return tSLiteralType(booleanLiteral(node.value))
    case 'FunctionTypeAnnotation': return functionToTsType(node)
    case 'GenericTypeAnnotation': return tSTypeReference(node.id)
    case 'IntersectionTypeAnnotation': return tSIntersectionType(node.types.map(ts))
    case 'MixedTypeAnnotation': return tSAnyKeyword()
    case 'NullLiteralTypeAnnotation': return tSNullKeyword()
    case 'NullableTypeAnnotation': return tSUnionType([ts(node.typeAnnotation), tSNullKeyword(), tSUndefinedKeyword()])
    case 'NumericLiteralTypeAnnotation': return tSLiteralType(numericLiteral(node.value))
    case 'NumberTypeAnnotation': return tSNumberKeyword()
    case 'StringLiteralTypeAnnotation': return tSLiteralType(stringLiteral(node.value))
    case 'StringTypeAnnotation': return tSStringKeyword()
    case 'ThisTypeAnnotation': return tSThisType()
    case 'TupleTypeAnnotation': return tSTupleType(node.types.map(ts))
    case 'TypeofTypeAnnotation': return tSTypeQuery(getId(node.argument))
    case 'TypeAnnotation': return ts(node.typeAnnotation)
    case 'ObjectTypeAnnotation': return tSTypeLiteral([
      ...node.properties.map(_ => {
      let s = tSPropertySignature(_.key, tSTypeAnnotation(ts(_.value)))
      s.optional = _.optional
      return s
      // TODO: anonymous indexers
      // TODO: named indexers
      // TODO: call properties
      // TODO: variance
      })
      // ...node.indexers.map(_ => tSIndexSignature())
    ])
    case 'UnionTypeAnnotation': return tSUnionType(node.types.map(ts))
    case 'VoidTypeAnnotation': return tSVoidKeyword()

    case 'ObjectTypeProperty':
      let _ = tSPropertySignature(node.key, tSTypeAnnotation(ts(node.value)))
      _.optional = node.optional
      _.readonly = node.variance && node.variance.kind === 'minus'
      return _

    case 'TypeCastExpression':
      return tSAsExpression(node.expression, ts(node.typeAnnotation))

    case 'TypeParameterDeclaration':
      let params = node.params.map(_ => {
        let d = (_ as any as TypeParameter).default
        let p = tSTypeParameter(
          hasBound(_) ? ts(_.bound.typeAnnotation) : undefined,
          d ? ts(d) : undefined
        )
        p.name = _.name
        return p
      })

      return tSTypeParameterDeclaration(params)

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
    case 'TSTypeLiteral':
    case 'TSTypeOperator':
    case 'TSTypePredicate':
    case 'TSTypeQuery':
    case 'TSTypeReference':
    case 'TSUndefinedKeyword':
    case 'TSUnionType':
    case 'TSVoidKeyword':
      return node
  }
}

type F<T, U> = (a: T, i: number, arr: T[]) => U

function map<T, U>(a: null, f: F<T, U>): null
function map<T, U>(a: undefined, f: F<T, U>): undefined
function map<T, U>(a: T[], f: F<T, U>): U[]
function map<T, U>(a: T[] | null | undefined, f: F<T, U>): U[] | null | undefined {
  if (!a) {
    return a
  }
  return a.map(f)
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

  let typeParams = undefined

  if (node.typeParameters) {
    typeParams = tSTypeParameterDeclaration(node.typeParameters.params.map(_ => {

      // TODO: How is this possible?
      if (isTSTypeParameter(_)) {
        return _
      }

      let constraint = _.bound ? ts(_.bound) : undefined
      let default_ = _.default ? ts(_.default) : undefined
      let param = tSTypeParameter(constraint, default_)
      param.name = _.name
      return param
    }))
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
        id.typeAnnotation = tSTypeAnnotation(ts(_.typeAnnotation))
      }

      return id
    })
  }

  // Return type
  if (node.returnType) {
    f.typeAnnotation = tSTypeAnnotation(ts(node.returnType))
  }

  return f
}

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}
