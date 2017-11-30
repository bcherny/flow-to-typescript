import generate from '@babel/generator'
import traverse, { Node, Visitor } from 'babel-traverse'
import { genericTypeAnnotation, identifier, nullLiteralTypeAnnotation, unionTypeAnnotation } from 'babel-types'
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

export function compile(code: string) {
  let ast = parse(code, { plugins: ['flow', 'objectRestSpread'] })

  let { leadingComments } = ast.program.body[0]
  if (leadingComments) {
    let index = leadingComments.findIndex(_ => _.value.trim() === '@flow')
    if (index > -1) {
      leadingComments.splice(index, 1)
    }
  }

  rules.forEach((visitor, ruleName) => {
    console.info(`Applying rule: "${ruleName}"`)
    traverse(ast, visitor)
  })

  return addTrailingSpace(trimLeadingNewlines(generate(ast, { retainLines: true }).code))
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
