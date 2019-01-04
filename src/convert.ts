import {
  booleanLiteral,
  Flow,
  FlowType,
  FunctionTypeAnnotation,
  identifier,
  Identifier,
  isSpreadElement,
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
  TypeParameter,
  tsQualifiedName,
  QualifiedTypeIdentifier,
  tsIndexSignature,
  tsTypeAliasDeclaration,
  tsTypeParameterInstantiation,
} from "@babel/types";
import { generateFreeIdentifier } from "./utils";

let depth = 0;
let stack = [];
// TODO: Add overloads
export function toTs(node: Flow | TSType): TSType {
  try {
    depth++;
    stack.push("  ".repeat(depth) + ` >${node.type}`);
    return _toTs(node);
  } catch (e) {
    if (!e.logged) {
      e.logged = true;
      stack.push("  ".repeat(depth) + ` !${node.type}`);
      console.error(stack.join("\n"));
      console.error(e);
      console.dir(node, { depth: 8 });
    }
    throw e;
  } finally {
    stack.push("  ".repeat(depth) + ` <${node.type}`);
    depth--;
    if (depth === 0) {
      stack = [];
    }
  }
}
export function _toTs(node: Flow | TSType): TSType {
  switch (node.type) {
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
    case "TSTypeAnnotation":
    case "TSTypeLiteral":
    case "TSTypeOperator":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeReference":
    case "TSUndefinedKeyword":
    case "TSUnionType":
    case "TSVoidKeyword":
    case "TSTypeParameterDeclaration":
    case "TSAsExpression":
    case "TSPropertySignature":
      return node;

    // Flow types
    case "TypeAnnotation":
      return tsTypeAnnotation(toTsType(node));
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "NumericLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
      return toTsType(node);

    case "ObjectTypeProperty":
      let _ = tsPropertySignature(node.key, tsTypeAnnotation(toTs(node.value)));
      _.optional = node.optional;
      _.readonly = node.variance && node.variance.kind === "minus";
      return _;

    case "TypeCastExpression":
      return tsAsExpression(node.expression, toTsType(node.typeAnnotation));

    case "TypeParameterDeclaration":
      let params = node.params.map(_ => {
        let d = ((_ as any) as TypeParameter).default;
        let p = tsTypeParameter(
          hasBound(_) ? toTsType(_.bound.typeAnnotation) : undefined,
          d ? toTs(d) : undefined
        );
        p.name = _.name;
        return p;
      });

      return tsTypeParameterDeclaration(params);

    case "QualifiedTypeIdentifier":
      return toTsType(node);

    /*
    case "ObjectTypeIndexer":
      return tsTypeLiteral([tsIndexSignature(node.parameters)]);
      */
    case "TypeAlias":
      return tsTypeAliasDeclaration(node.id, null, toTs(node.right));

    case "ClassImplements":
    case "ClassProperty":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareTypeAlias":
    case "DeclareVariable":
    case "ExistentialTypeParam":
    case "FunctionTypeParam":
    case "InterfaceExtends":
    case "InterfaceDeclaration":
    case "TypeAlias":
    case "TypeParameterInstantiation":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
      console.log("WUT");
      console.dir(node);
      throw "wut";
  }
}

export function toTsTypeName(node: FlowType): TsType {
  switch (node.type) {
    case "Identifier":
      return node;
    case "QualifiedTypeIdentifier":
      return tsQualifiedName(node.qualification, node.id);
  }
}
export function toTsType(node: FlowType): TSType {
  if (node.type.match(/^TS[A-Z]/)) {
    return node;
  }
  switch (node.type) {
    case "Identifier":
    case "QualifiedTypeIdentifier":
      return tsTypeReference(toTsTypeName(node));
    case "AnyTypeAnnotation":
      return tsAnyKeyword();
    case "ArrayTypeAnnotation":
      return tsArrayType(toTsType(node.elementType));
    case "BooleanTypeAnnotation":
      return tsBooleanKeyword();
    case "BooleanLiteralTypeAnnotation":
      return tsLiteralType(booleanLiteral(node.value!));
    case "FunctionTypeAnnotation":
      return functionToTsType(node);
    case "GenericTypeAnnotation": {
      if (node.typeParameters && node.typeParameters.params.length) {
        return tsTypeReference(
          toTsTypeName(node.id),
          tsTypeParameterInstantiation(
            node.typeParameters.params.map(p => toTsType(p))
          )
        );
      } else {
        return toTsType(node.id);
      }
      /*
      let type;
      if (node.id.type === "Identifier") {
        type = toTsType(node.id);
      } else {
        type = toTs(node.id);
      }
      type.typeArguments = toTsType(node.typeParameters),
      return type;
      */
    }
    /*
      if (node.id.type === "QualifiedTypeIdentifier") {
        return toTsType(node.id);
      } else {
        return tsTypeReference(node.id);
      }
      */
    case "IntersectionTypeAnnotation":
      return tsIntersectionType(node.types.map(toTsType));
    case "MixedTypeAnnotation":
      return tsAnyKeyword();
    case "NullLiteralTypeAnnotation":
      return tsNullKeyword();
    case "NullableTypeAnnotation":
      return tsUnionType([
        toTsType(node.typeAnnotation),
        tsNullKeyword(),
        tsUndefinedKeyword(),
      ]);
    case "NumberLiteralTypeAnnotation":
      return tsLiteralType(numericLiteral(node.value!));
    case "NumberTypeAnnotation":
      return tsNumberKeyword();
    case "StringLiteralTypeAnnotation":
      return tsLiteralType(stringLiteral(node.value!));
    case "StringTypeAnnotation":
      return tsStringKeyword();
    case "ThisTypeAnnotation":
      return tsThisType();
    case "TupleTypeAnnotation":
      return tsTupleType(node.types.map(toTsType));
    case "TypeofTypeAnnotation":
      return tsTypeQuery(getId(node.argument));

    case "TypeAnnotation":
      return toTs(node.typeAnnotation);

    case "ObjectTypeAnnotation":
      return tsTypeLiteral([
        ...node.properties.map(_ => {
          if (isSpreadElement(_)) {
            return _;
          }
          let s = tsPropertySignature(
            _.key,
            tsTypeAnnotation(toTsType(_.typeAnnotation || _.value))
          );
          s.optional = _.optional;
          return s;
          // TODO: anonymous indexers
          // TODO: named indexers
          // TODO: call properties
          // TODO: variance
        }),
        // ...node.indexers.map(_ => tSIndexSignature())
      ]);
    case "UnionTypeAnnotation":
      return tsUnionType(node.types.map(toTs));
    case "VoidTypeAnnotation":
      return tsVoidKeyword();
    case "ExistsTypeAnnotation":
      return tsAnyKeyword();
    default:
      throw new Error(`Didn't understand type '${node.type}'`);
  }
}

function getId(node: FlowType): Identifier {
  switch (node.type) {
    case "GenericTypeAnnotation":
      return node.id;
    default:
      throw ReferenceError("typeof query must reference a node that has an id");
  }
}

function functionToTsType(node: FunctionTypeAnnotation): TSFunctionType {
  let typeParams = undefined;

  if (node.typeParameters) {
    typeParams = tsTypeParameterDeclaration(
      node.typeParameters.params.map(_ => {
        // TODO: How is this possible?
        if (isTSTypeParameter(_)) {
          return _;
        }

        let constraint = _.bound ? toTs(_.bound) : undefined;
        let default_ = _.default ? toTs(_.default) : undefined;
        let param = tsTypeParameter(constraint, default_);
        param.name = _.name;
        return param;
      })
    );
  }

  const returnTypeType = node.returnType ? toTs(node.returnType) : null;
  if (node.returnType && !returnTypeType) {
    console.dir(node.returnType);
    throw new Error(`Could not convert return type '${node.returnType.type}'`);
  }
  let f = tsFunctionType(
    typeParams,
    node.returnType ? tsTypeAnnotation(returnTypeType) : undefined
  );
  // Params
  if (node.params) {
    // TODO: Rest params
    let paramNames = node.params
      .map(_ => _.name)
      .filter(_ => _ !== null)
      .map(_ => (_ as Identifier).name);
    f.parameters = node.params.map(_ => {
      let name = _.name && _.name.name;

      // Generate param name? (Required in TS, optional in Flow)
      if (name == null) {
        name = generateFreeIdentifier(paramNames);
        paramNames.push(name);
      }

      let id = identifier(name);

      if (_.typeAnnotation) {
        id.typeAnnotation = tsTypeAnnotation(toTsType(_.typeAnnotation));
      }

      return id;
    });
  }

  return f;
}

function hasBound(node: Node): node is BoundedTypeParameter {
  return isTypeParameter(node) && node.bound != null;
}

interface BoundedTypeParameter extends TypeParameter {
  bound: TypeAnnotation;
}
