import generate from 'babel-generator'
import traverse, { Node, Visitor } from 'babel-traverse'
import { File } from 'babel-types'
import { parse } from 'babylon'
import { sync } from 'glob'
import { dropWhile } from 'lodash'
import { EOL } from 'os'
import { relative, resolve } from 'path'

type Warning = [string, number, number]
type Rule = (warnings: Warning[]) => Visitor<Node>

let rules = new Map<string, Rule>()

export function addRule(ruleName: string, rule: Rule) {
  if (rules.has(ruleName)) {
    throw `A rule with the name "${ruleName}" is already defined`
  }
  rules.set(ruleName, rule)
}

export async function compile(code: string, filename: string) {
  let ast = parse(code, { plugins: ['flow', 'objectRestSpread'] })

  // load rules directory
  await Promise.all(sync(resolve(__dirname, './rules/*.js')).map(_ => import(_)))

  let warnings: Warning[] = []

  rules.forEach((visitor, ruleName) => {
    console.info(`Applying rule: "${ruleName}"`)
    traverse(ast, visitor(warnings))
  })

  warnings.forEach(([message, line, column]) => {
    console.log(`Warning: ${message} (at ${relative(__dirname, filename)}: line ${line}, column ${column})`)
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
