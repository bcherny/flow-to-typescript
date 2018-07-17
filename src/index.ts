import generate from '@babel/generator'
import { Node, Visitor } from 'babel/packages/babel-traverse/lib'
import { File } from 'babel/packages/babel-types/lib'
import { parse } from 'babel/packages/babylon/lib'
import { dropWhile } from 'lodash'
import { EOL } from 'os'
import { relative } from 'path'
import { convert as convertAST } from './convert'

type Warning = [string, string, number, number]
type Rule = (warnings: Warning[]) => Visitor<Node>

let rules = new Map<string, Rule>()

export function addRule(ruleName: string, rule: Rule) {
  if (rules.has(ruleName)) {
    throw `A rule with the name "${ruleName}" is already defined`
  }
  rules.set(ruleName, rule)
}

export async function compile(code: string, filename: string) {

  let [warnings, ast] = await convert(
    parse(code, { plugins: ['classProperties', 'flow', 'objectRestSpread'], sourceType: 'module' })
  )

  warnings.forEach(([message, issueURL, line, column]) => {
    console.log(`Warning: ${message} (at ${relative(__dirname, filename)}: line ${line}, column ${column}). See ${issueURL}`)
  })

  return addTrailingSpace(trimLeadingNewlines(generate(stripAtFlowAnnotation(ast)).code))
}

/**
 * @internal
 */
export async function convert(ast: File): Promise<[Warning[], File]> {

  // load rules directory
  // await Promise.all(sync(resolve(__dirname, './rules/*.js')).map(_ => import(_)))

  // let warnings: Warning[] = []
  // rules.forEach(visitor =>
  //   traverse(ast, visitor(warnings))
  // )

  return [[], convertAST(ast)]
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
