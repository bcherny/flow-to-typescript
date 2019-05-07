import {
  FunctionTypeAnnotation,
  GenericTypeAnnotation,
  identifier,
  Identifier,
  InterfaceExtends,
  isTSTypeParameter,
  objectTypeIndexer,
  ObjectTypeIndexer,
  tsExpressionWithTypeArguments,
  tsFunctionType,
  TSFunctionType,
  tsTypeAnnotation,
  tsTypeParameter,
  tsTypeParameterDeclaration,
  tsTypeParameterInstantiation,
  TSTypeParameterInstantiation,
  tsTypeReference,
  TSTypeReference,
  TypeParameterInstantiation
} from "@babel/types"
import { getValue, isDefined, isString } from "typeguard"
import { KVMap } from "../types/types"
import { generateFreeIdentifier } from "../utils/index"
import { toTs, toTsType } from "./to-typescript-mapper"

const TypeMappings: KVMap<string, string> = {
  $Shape: "Partial",
  $Exact: "",
  $ReadOnly: "Readonly"
}

export function toTsImplementExtends(_extends: Array<InterfaceExtends> | null) {
  return !_extends
    ? null
    : _extends
        .map((extendz: any) =>
          extendz.type === "InterfaceExtends"
            ? tsExpressionWithTypeArguments(extendz.id, toTsTypeParameterInstantiation(extendz.typeParameters))
            : null
        )
        .filter(it => !!it)
}

export function toTsTypeParameterInstantiation(
  typeInstantiation: TypeParameterInstantiation | null
): TSTypeParameterInstantiation | null {
  if (!typeInstantiation || typeInstantiation.type !== "TypeParameterInstantiation") return null

  return tsTypeParameterInstantiation(
    !typeInstantiation.params ? null : (typeInstantiation.params.map(param => toTs(param)) as any)
  )
}

export function genericTypeAnnotationToTS(node: GenericTypeAnnotation | null): TSTypeReference | null {
  if (!node || node.type !== "GenericTypeAnnotation") return null
  const id = node.id as Identifier
  const newName = isDefined(TypeMappings[id.name]) ? TypeMappings[id.name] : id.name
  if (!isDefined(newName)) {
    return tsTypeReference({ ...id }, toTsTypeParameterInstantiation(node.typeParameters))
  } else if (newName === "$Keys") {
    //const subNode = getValue(() => (node.typeParameters!!.params[0] as any).name) as any
    return tsTypeReference({
      ...id,
      name: "string[]"
    })
  } else if (newName.length) {
    return tsTypeReference(
      {
        ...id,
        name: newName
      },
      toTsTypeParameterInstantiation(node.typeParameters)
    )
  } else {
    const subNode = getValue(() => node.typeParameters!!.params[0] as any) as any,
      subName = getValue(() => subNode.id.name, subNode.name)
    return tsTypeReference({
      ...id,
      name: subName
    })
  }
}

export function functionToTsType(node: FunctionTypeAnnotation): TSFunctionType {
  let typeParams = undefined

  if (node.typeParameters) {
    typeParams = tsTypeParameterDeclaration(
      node.typeParameters.params.map(param => {
        // TODO: How is this possible?
        if (isTSTypeParameter(param)) {
          return param
        }

        const constraint = param.bound ? toTs(param.bound) : undefined
        const default_ = param.default ? toTs(param.default) : undefined
        const tsParam = tsTypeParameter(constraint, default_)
        tsParam.name = param.name
        return tsParam
      })
    )
  }

  // @ts-ignore
  let f = tsFunctionType(typeParams)

  // Params
  if (node.params) {
    // TODO: Rest params
    let paramNames = node.params
      .map(param => ((param as any).argument ? (param as any).argument : param.name))
      .filter(name => !!name)
      .map(name => (isString(name) ? name : (name as Identifier).name))

    f.parameters = node.params.map(param => {
      let name: any = !param.name ? null : isString(param.name) ? param.name : param.name.name

      // Generate param name? (Required in TS, optional in Flow)
      if (!name) {
        name = generateFreeIdentifier(paramNames)
        paramNames.push(name)
      }

      if ((param as any).type === "RestElement") {
        return {
          ...param,
          typeAnnotation: tsTypeAnnotation(toTs(param.typeAnnotation)!!)
        }
      } else {
        const id = identifier(name)

        if (param.typeAnnotation) {
          id.typeAnnotation = tsTypeAnnotation(toTs(param.typeAnnotation)!!)
        }

        return id
      }
    }) as any
  }

  // Return type
  if (node.returnType) {
    const typeRef = tsTypeAnnotation(toTsType(node.returnType)!!)
    f.typeAnnotation = typeRef
    ;(f as any).returnType = typeRef
  }

  return f
}

export function toTsIndexer(node: ObjectTypeIndexer | null): ObjectTypeIndexer | null {
  if (!node) return node

  const name = getValue(() => (node.id as any).name, generateFreeIdentifier([]))

  return objectTypeIndexer(identifier(name), node.key, node.value)
}
