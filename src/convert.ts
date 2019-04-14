import { booleanLiteral, File, Flow, FunctionTypeAnnotation, Identifier, identifier, isTSTypeParameter, isTypeParameter, LVal, Node, numericLiteral, stringLiteral, tsAnyKeyword, tsArrayType, tsAsExpression, tsBooleanKeyword, tsFunctionType, TSFunctionType, tsIntersectionType, tsLiteralType, tsNullKeyword, tsNumberKeyword, tsPropertySignature, tsStringKeyword, tsThisType, tsTupleType, TSType, tsTypeAnnotation, tsTypeLiteral, tsTypeParameter, tsTypeParameterDeclaration, tsTypeQuery, tsTypeReference, tsUndefinedKeyword, tsUnionType, tsVoidKeyword, TypeAnnotation, TypeParameter, VariableDeclarator } from '@babel/types'
import * as t from '@babel/types'
import { generateFreeIdentifier } from './utils'

type AnyNode = AnyNonFlowNode | Flow
type AnyNonFlowNode = LVal | t.Statement | t.Declaration | TSType | VariableDeclarator
  | t.Expression | t.Literal | t.ModuleSpecifier | t.JSX
  | t.File | t.Program | null | undefined | t.Property

type TS = {

  // LVals
  (node: t.Identifier): t.Identifier
  (node: t.MemberExpression): t.MemberExpression
  (node: t.RestElement): t.RestElement
  (node: t.AssignmentPattern): t.AssignmentPattern
  (node: t.ArrayPattern): t.ArrayPattern
  (node: t.ObjectPattern): t.ObjectPattern
  (node: t.TSParameterProperty): t.TSParameterProperty

  // ModuleSpecifiers
  (node: t.ExportSpecifier): t.ExportSpecifier
  (node: t.ImportDefaultSpecifier): t.ImportDefaultSpecifier
  (node: t.ImportNamespaceSpecifier): t.ImportNamespaceSpecifier
  (node: t.ImportSpecifier): t.ImportSpecifier
  (node: t.ExportDefaultSpecifier): t.ExportDefaultSpecifier
  (node: t.ExportNamespaceSpecifier): t.ExportNamespaceSpecifier

  // Statements
  (node: t.BlockStatement): t.BlockStatement
  (node: t.BreakStatement): t.BreakStatement
  (node: t.ContinueStatement): t.ContinueStatement
  (node: t.DebuggerStatement): t.DebuggerStatement
  (node: t.DoWhileStatement): t.DoWhileStatement
  (node: t.EmptyStatement): t.EmptyStatement
  (node: t.ExpressionStatement): t.ExpressionStatement
  (node: t.ForInStatement): t.ForInStatement
  (node: t.ForStatement): t.ForStatement
  (node: t.FunctionDeclaration): t.FunctionDeclaration
  (node: t.IfStatement): t.IfStatement
  (node: t.LabeledStatement): t.LabeledStatement
  (node: t.ReturnStatement): t.ReturnStatement
  (node: t.SwitchStatement): t.SwitchStatement
  (node: t.ThrowStatement): t.ThrowStatement
  (node: t.TryStatement): t.TryStatement
  (node: t.VariableDeclaration): t.VariableDeclaration
  (node: t.WhileStatement): t.WhileStatement
  (node: t.WithStatement): t.WithStatement
  (node: t.ClassDeclaration): t.ClassDeclaration
  (node: t.ExportAllDeclaration): t.ExportAllDeclaration
  (node: t.ExportDefaultDeclaration): t.ExportDefaultDeclaration
  (node: t.ExportNamedDeclaration): t.ExportNamedDeclaration
  (node: t.ForOfStatement): t.ForOfStatement
  (node: t.ImportDeclaration): t.ImportDeclaration

  // Statements (TS)
  (node: t.TSDeclareFunction): t.TSDeclareFunction
  (node: t.TSInterfaceDeclaration): t.TSInterfaceDeclaration
  (node: t.TSTypeAliasDeclaration): t.TSTypeAliasDeclaration
  (node: t.TSEnumDeclaration): t.TSEnumDeclaration
  (node: t.TSModuleDeclaration): t.TSModuleDeclaration
  (node: t.TSImportEqualsDeclaration): t.TSImportEqualsDeclaration
  (node: t.TSExportAssignment): t.TSExportAssignment
  (node: t.TSNamespaceExportDeclaration): t.TSNamespaceExportDeclaration

  // Declarations
  (node: t.InterfaceDeclaration): t.InterfaceDeclaration
  (node: t.TypeAlias): t.TypeAlias

  // Expressions
  (node: t.ArrayExpression): t.ArrayExpression
  (node: t.AssignmentExpression): t.AssignmentExpression
  (node: t.BinaryExpression): t.BinaryExpression
  (node: t.CallExpression): t.CallExpression
  (node: t.ConditionalExpression): t.ConditionalExpression
  (node: t.FunctionExpression): t.FunctionExpression
  (node: t.StringLiteral): t.StringLiteral
  (node: t.NumericLiteral): t.NumericLiteral
  (node: t.BooleanLiteral): t.BooleanLiteral
  (node: t.NullLiteral): t.NullLiteral
  (node: t.RegExpLiteral): t.RegExpLiteral
  (node: t.LogicalExpression): t.LogicalExpression
  (node: t.NewExpression): t.NewExpression
  (node: t.ObjectExpression): t.ObjectExpression
  (node: t.SequenceExpression): t.SequenceExpression
  (node: t.ThisExpression): t.ThisExpression
  (node: t.UnaryExpression): t.UnaryExpression
  (node: t.UpdateExpression): t.UpdateExpression
  (node: t.ArrowFunctionExpression): t.ArrowFunctionExpression
  (node: t.ClassExpression): t.ClassExpression
  (node: t.MetaProperty): t.MetaProperty
  (node: t.Super): t.Super
  (node: t.TaggedTemplateExpression): t.TaggedTemplateExpression
  (node: t.YieldExpression): t.YieldExpression
  (node: t.TypeCastExpression): t.TypeCastExpression
  (node: t.ParenthesizedExpression): t.ParenthesizedExpression
  (node: t.AwaitExpression): t.AwaitExpression
  (node: t.BindExpression): t.BindExpression
  (node: t.DoExpression): t.DoExpression
  (node: t.TSAsExpression): t.TSAsExpression
  (node: t.TSNonNullExpression): t.TSNonNullExpression
  (node: t.TSTypeAssertion): t.TSTypeAssertion

  // Literals
  (node: t.StringLiteral): t.StringLiteral
  (node: t.NumericLiteral): t.NumericLiteral
  (node: t.BooleanLiteral): t.BooleanLiteral
  (node: t.NullLiteral): t.NullLiteral
  (node: t.RegExpLiteral): t.RegExpLiteral
  (node: t.TemplateLiteral): t.TemplateLiteral

  // JSX
  (node: t.JSXAttribute): t.JSXAttribute
  (node: t.JSXClosingElement): t.JSXClosingElement
  (node: t.JSXElement): t.JSXElement
  (node: t.JSXEmptyExpression): t.JSXEmptyExpression
  (node: t.JSXExpressionContainer): t.JSXExpressionContainer
  (node: t.JSXSpreadChild): t.JSXSpreadChild
  (node: t.JSXIdentifier): t.JSXIdentifier
  (node: t.JSXMemberExpression): t.JSXMemberExpression
  (node: t.JSXNamespacedName): t.JSXNamespacedName
  (node: t.JSXOpeningElement): t.JSXOpeningElement
  (node: t.JSXSpreadAttribute): t.JSXSpreadAttribute
  (node: t.JSXText): t.JSXText
  (node: t.JSXFragment): t.JSXFragment
  (node: t.JSXOpeningFragment): t.JSXOpeningFragment
  (node: t.JSXClosingFragment): t.JSXClosingFragment

  // FlowBaseAnnotations
  (node: t.AnyTypeAnnotation): t.TSAnyKeyword
  (node: t.ArrayTypeAnnotation): t.TSArrayType
  (node: t.BooleanTypeAnnotation): t.TSBooleanKeyword
  (node: t.BooleanLiteralTypeAnnotation): t.TSLiteralType
  (node: t.FunctionTypeAnnotation): t.TSFunctionType
  (node: t.GenericTypeAnnotation): t.TSTypeReference
  (node: t.IntersectionTypeAnnotation): t.TSIntersectionType
  (node: t.MixedTypeAnnotation): t.TSAnyKeyword
  (node: t.NullableTypeAnnotation): t.TSUnionType
  (node: t.NullLiteralTypeAnnotation): t.TSNullKeyword
  (node: t.NumberLiteralTypeAnnotation): t.TSLiteralType
  (node: t.NumberTypeAnnotation): t.TSNumberKeyword
  (node: t.StringLiteralTypeAnnotation): t.TSLiteralType
  (node: t.StringTypeAnnotation): t.TSStringKeyword
  (node: t.ThisTypeAnnotation): t.TSThisType
  (node: t.TupleTypeAnnotation): t.TSTupleType
  (node: t.TypeofTypeAnnotation): t.TSTypeOperator
  (node: t.TypeAnnotation): t.TSTypeAnnotation
  (node: t.ObjectTypeAnnotation): t.TSObjectKeyword
  (node: t.UnionTypeAnnotation): t.TSUnionType
  (node: t.VoidTypeAnnotation): t.TSVoidKeyword

  // Flow types
  (node: t.ClassImplements): t.TSExpressionWithTypeArguments
  (node: t.ClassProperty): t.ClassProperty
  (node: t.DeclareClass): t.DeclareClass
  (node: t.DeclareFunction): t.TSDeclareFunction
  (node: t.DeclareInterface): t.TSInterfaceDeclaration
  (node: t.DeclareModule): t.TSModuleDeclaration
  (node: t.DeclareModuleExports): t.DeclareModuleExports
  (node: t.DeclareTypeAlias): t.TSTypeAliasDeclaration
  (node: t.DeclareOpaqueType): t.TSTypeAliasDeclaration
  (node: t.DeclareVariable): t.DeclareVariable
  (node: t.DeclareExportDeclaration): t.DeclareExportDeclaration
  (node: t.DeclareExportAllDeclaration): t.DeclareExportAllDeclaration
  (node: t.InterfaceDeclaration): t.InterfaceDeclaration
  (node: t.FunctionTypeParam): t.TSParameterProperty
  (node: t.InterfaceExtends): t.InterfaceExtends
  (node: t.OpaqueType): t.OpaqueType
  (node: t.TypeAlias): t.TypeAlias
  (node: t.TypeCastExpression): t.TSAsExpression
  (node: t.TypeParameterDeclaration): t.TSTypeParameterDeclaration
  (node: t.TypeParameterInstantiation): t.TSTypeParameterInstantiation
  (node: t.ObjectTypeCallProperty): t.ObjectTypeCallProperty // TODO
  (node: t.ObjectTypeIndexer): t.ObjectTypeIndexer
  (node: t.ObjectTypeProperty): t.ObjectTypeProperty
  (node: t.QualifiedTypeIdentifier): t.QualifiedTypeIdentifier

  // Other
  (node: t.File): t.File
  (node: t.Program): t.Program

  (node: t.Directive): t.Directive
  (node: t.VariableDeclarator): t.VariableDeclarator

  (node: t.ArgumentPlaceholder): t.ArgumentPlaceholder
  (node: t.CatchClause): t.CatchClause
  (node: t.Directive): t.Directive
  (node: t.VariableDeclarator): t.VariableDeclarator
  (node: t.ClassBody): t.ClassBody
  (node: t.ClassMethod): t.ClassMethod
  (node: t.ClassPrivateMethod): t.ClassPrivateMethod
  (node: t.ClassPrivateProperty): t.ClassPrivateProperty
  (node: t.DeclaredPredicate): t.DeclaredPredicate
  (node: t.Decorator): t.Decorator
  (node: t.DirectiveLiteral): t.DirectiveLiteral
  (node: t.EmptyTypeAnnotation): t.TSUnknownKeyword
  (node: t.ExistsTypeAnnotation): t.ExistsTypeAnnotation // TODO
  (node: t.Import): t.Import
  (node: t.InferredPredicate): t.InferredPredicate
  (node: t.InterfaceTypeAnnotation): t.InterfaceTypeAnnotation
  (node: t.InterpreterDirective): t.InterpreterDirective
  (node: t.Noop): t.Noop
  (node: t.ObjectMethod): t.ObjectMethod
  (node: t.ObjectProperty): t.ObjectProperty
  (node: t.ObjectTypeInternalSlot): t.ObjectTypeInternalSlot
  (node: t.ObjectTypeSpreadProperty): t.ObjectTypeSpreadProperty
  (node: t.OptionalCallExpression): t.OptionalCallExpression
  (node: t.OptionalMemberExpression): t.OptionalMemberExpression
  (node: t.PipelineBareFunction): t.PipelineBareFunction
  (node: t.PipelinePrimaryTopicReference): t.PipelinePrimaryTopicReference
  (node: t.PipelineTopicExpression): t.PipelineTopicExpression
  (node: t.Placeholder): t.Placeholder
  (node: t.PrivateName): t.PrivateName
  (node: t.SpreadElement): t.SpreadElement
  (node: t.SwitchCase): t.SwitchCase
  (node: t.TSAnyKeyword): t.TSAnyKeyword
  (node: t.TSArrayType): t.TSArrayType
  (node: t.TSBooleanKeyword): t.TSBooleanKeyword
  (node: t.TSCallSignatureDeclaration): t.TSCallSignatureDeclaration
  (node: t.TSConditionalType): t.TSConditionalType
  (node: t.TSConstructSignatureDeclaration): t.TSConstructSignatureDeclaration
  (node: t.TSConstructorType): t.TSConstructorType
  (node: t.TSDeclareMethod): t.TSDeclareMethod
  (node: t.TSEnumMember): t.TSEnumMember
  (node: t.TSExpressionWithTypeArguments): t.TSExpressionWithTypeArguments
  (node: t.TSExternalModuleReference): t.TSExternalModuleReference
  (node: t.TSFunctionType): t.TSFunctionType
  (node: t.TSImportType): t.TSImportType
  (node: t.TSIndexSignature): t.TSIndexSignature
  (node: t.TSIndexedAccessType): t.TSIndexedAccessType
  (node: t.TSInferType): t.TSInferType
  (node: t.TSInterfaceBody): t.TSInterfaceBody
  (node: t.TSIntersectionType): t.TSIntersectionType
  (node: t.TSLiteralType): t.TSLiteralType
  (node: t.TSMappedType): t.TSMappedType
  (node: t.TSMethodSignature): t.TSMethodSignature
  (node: t.TSModuleBlock): t.TSModuleBlock
  (node: t.TSNeverKeyword): t.TSNeverKeyword
  (node: t.TSNullKeyword): t.TSNullKeyword
  (node: t.TSNumberKeyword): t.TSNumberKeyword
  (node: t.TSObjectKeyword): t.TSObjectKeyword
  (node: t.TSOptionalType): t.TSOptionalType
  (node: t.TSParenthesizedType): t.TSParenthesizedType
  (node: t.TSPropertySignature): t.TSPropertySignature
  (node: t.TSQualifiedName): t.TSQualifiedName
  (node: t.TSRestType): t.TSRestType
  (node: t.TSStringKeyword): t.TSStringKeyword
  (node: t.TSSymbolKeyword): t.TSSymbolKeyword
  (node: t.TSThisType): t.TSThisType
  (node: t.TSTupleType): t.TSTupleType
  (node: t.TSTypeAnnotation): t.TSTypeAnnotation
  (node: t.TSTypeLiteral): t.TSTypeLiteral
  (node: t.TSTypeOperator): t.TSTypeOperator
  (node: t.TSTypeParameter): t.TSTypeParameter
  (node: t.TSTypeParameterDeclaration): t.TSTypeParameterDeclaration
  (node: t.TSTypeParameterInstantiation): t.TSTypeParameterInstantiation
  (node: t.TSTypePredicate): t.TSTypePredicate
  (node: t.TSTypeQuery): t.TSTypeQuery
  (node: t.TSTypeReference): t.TSTypeReference
  (node: t.TSUndefinedKeyword): t.TSUndefinedKeyword
  (node: t.TSUnionType): t.TSUnionType
  (node: t.TSUnknownKeyword): t.TSUnknownKeyword
  (node: t.TSVoidKeyword): t.TSVoidKeyword
  (node: t.TemplateElement): t.TemplateElement
  (node: t.TypeParameter): t.TypeParameter
  (node: t.Variance): t.Variance

  // Catch-alls
  (node: t.Expression): t.Expression
  (node: t.LVal): t.LVal
  (node: t.Statement): t.Statement
  (node: AnyNode): AnyNonFlowNode
}

type TSToFlowMap = {
  Identifier: t.Identifier
}

type RemainingNodeTypes = Exclude<t.Node['type'], keyof TSToFlowMap>
type AllNodesMap = TSToFlowMap & {
  [T in RemainingNodeTypes]: Extract<t.Node, {type: T}>
}

export function convert<
  T extends keyof AllNodesMap,
  N extends Extract<t.Node, {type: T}>
>(
  node: N
): AllNodesMap[T] {
  if (t.isIdentifier(node)) {
    return node
  }
  throw `Unsupported node type ${node.type}`
}

type F<T, U> = (a: T) => U

function map<T, U>(a: null, f: F<T, U>): null
function map<T, U>(a: undefined, f: F<T, U>): undefined
function map<T, U>(a: T[], f: F<T, U>): U[]
function map<T, U>(a: T[] | null | undefined, f: F<T, U>): U[] | null | undefined {
  if (!a) {
    return a
  }
  return a.map(_ => f(_))
}

function getId(node: t.FlowType): Identifier {
  if (t.isGenericTypeAnnotation(node) && t.isIdentifier(node.id)) {
    return node.id
  }
  throw ReferenceError('typeof query must reference a node that has an id')
}

function functionToTsType(node: FunctionTypeAnnotation): TSFunctionType {
  let typeParams

  if (node.typeParameters) {
    typeParams = tsTypeParameterDeclaration(node.typeParameters.params.map(_ => {

      // TODO: How is this possible?
      if (isTSTypeParameter(_)) {
        return _
      }

      let constraint = _.bound ? ts(_.bound) : undefined
      let default_ = _.default ? ts(_.default) : undefined
      let param = tsTypeParameter(constraint, default_)
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
        id.typeAnnotation = tsTypeAnnotation(ts(_.typeAnnotation))
      }

      return id
    })
  }

  // Return type
  if (node.returnType) {
    f.typeAnnotation = tsTypeAnnotation(ts(node.returnType))
  }

  return f
}

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation
}
