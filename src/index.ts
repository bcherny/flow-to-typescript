import generate from '@babel/generator'
import traverse, { Node, Visitor } from 'babel-traverse'
import { File, genericTypeAnnotation, identifier, nullLiteralTypeAnnotation, unionTypeAnnotation } from 'babel-types'
import { parse } from 'babylon'
import { dropWhile } from 'lodash'
import { EOL } from 'os'

let rules = new Map<string, Visitor<Node>>()

rules.set('Maybe', {
  NullableTypeAnnotation(path) {
    path.replaceWith(unionTypeAnnotation([
      (path.node as any).typeAnnotation,
      nullLiteralTypeAnnotation(),
      genericTypeAnnotation(identifier('undefined'))
    ]))
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
