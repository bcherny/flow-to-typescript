import generate from '@babel/generator'
import traverse, { Node, Visitor } from 'babel-traverse'
import { File, functionTypeAnnotation, functionTypeParam, genericTypeAnnotation, identifier, nullLiteralTypeAnnotation, objectTypeAnnotation, unionTypeAnnotation } from 'babel-types'
import { parse } from 'babylon'
import { dropWhile } from 'lodash'
import { EOL } from 'os'

let rules = new Map<string, Visitor<Node>>()

rules.set('Functions', {
  FunctionTypeAnnotation(path) {

    if (path.node.params.every(_ => _.name !== null)) {
      return
    }

    let paramNames = path.node.params.map(_ => _.name).filter(_ => _ !== null).map(_ => _.name)
    let params = path.node.params.map(param => {
      if (param.name === null) {
        let id = generateFreeIdentifier(paramNames)
        paramNames.push(id)
        return functionTypeParam(identifier(id), param.typeAnnotation)
      }
      return param
    })
    path.replaceWith(functionTypeAnnotation(path.node.typeParameters, params, path.node.rest, path.node.returnType))
  }
})

const candidates = 'abcdefghijklmnopqrstuvwxyz'.split('')
function generateFreeIdentifier(usedParamNames: string[]) {
  return candidates.find(_ => usedParamNames.indexOf(_) < 0)!
}

rules.set('Maybe', {
  NullableTypeAnnotation(path) {
    path.replaceWith(unionTypeAnnotation([
      (path.node as any).typeAnnotation,
      nullLiteralTypeAnnotation(),
      genericTypeAnnotation(identifier('undefined'))
    ]))
  }
})

rules.set('Mixed', {
  MixedTypeAnnotation(path) {
    path.replaceWith(objectTypeAnnotation([]))
  }
})

rules.set('Undefined', {
  VoidTypeAnnotation(path) {
    path.replaceWith(genericTypeAnnotation(identifier('undefined')))
  }
})

export function compile(code: string) {
  let ast = parse(code, { plugins: ['flow', 'objectRestSpread'] })

  rules.forEach((visitor, ruleName) => {
    console.info(`Applying rule: "${ruleName}"`)
    traverse(ast, visitor)
  })

  return addTrailingSpace(trimLeadingNewlines(generate(stripAtFlowAnnotation(ast), { retainLines: true }).code))
}

function stripAtFlowAnnotation(ast: File): File {
  let { leadingComments } = ast.program.body[0]
  if (leadingComments) {
    let index = leadingComments.findIndex(_ => _.value.trim() === '@flow')
    if (index > -1) {
      leadingComments.splice(index, 1)
    }
  }
  return ast
}

function addTrailingSpace(file: string): string {
  if (file.endsWith(EOL)) {
    return file
  }
  return file + EOL
}

function trimLeadingNewlines(file: string): string {
  return dropWhile(file.split(EOL), _ => !_).join(EOL)
}
