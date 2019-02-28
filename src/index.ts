import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse, { Node, Visitor } from '@babel/traverse'
import { File } from '@babel/types'
import { sync } from 'glob'
import { dropWhile, pullAt } from 'lodash'
import { EOL } from 'os'
import { relative, resolve } from 'path'

export type Warning = [string, string, number, number]
type ObjVisitor<T> = { [key: string]: Visitor<T>[keyof Visitor<T>] }
type Rule = (warnings: Warning[]) => Visitor<Node>

let rules = new Map<string, Rule>()

export function addRule(ruleName: string, rule: Rule) {
  if (rules.has(ruleName)) {
    throw `A rule with the name "${ruleName}" is already defined`
  }
  rules.set(ruleName, rule)
}

export async function compile(code: string, filename: string) {
  const parsed = parse(code, {
    plugins: ['classProperties', 'flow', 'objectRestSpread'],
    sourceType: 'module'
  })
  let [warnings, ast] = await convert(parsed)

  warnings.forEach(([message, issueURL, line, column]) => {
    console.log(
      `Warning: ${message} (at ${relative(
        __dirname,
        filename
      )}: line ${line}, column ${column}). See ${issueURL}`
    )
  })

  return addTrailingSpace(
    trimLeadingNewlines(generate(stripAtFlowAnnotation(ast)).code)
  )
}

/**
 * @internal
 */
export async function convert<T extends Node>(ast: T): Promise<[Warning[], T]> {
  // load rules directory
  await Promise.all(
    sync(resolve(__dirname, './rules/*.js')).map(_ => import(_))
  )

  let warnings: Warning[] = []
  const order = [
    '$Exact',
    '$Keys',
    '$ReadOnly',
    'Bounds',
    'Casting',
    'Exact',
    'Variance',
    'Indexer',
    'TypeAlias'
  ]
  const keys = [...rules.keys()]
  const all = [...order, ...keys.filter(k => order.indexOf(k) < 0)]
  const visitor = all.reduce<ObjVisitor<Node>>((agg, i) => {
    const visGen = rules.get(i)!
    if (!visGen) return agg
    const vis = visGen(warnings) as ObjVisitor<Node>
    Object.keys(vis).forEach(k => {
      if (!agg[k]) {
        agg[k] = vis[k]
      } else {
        const oldVis = agg[k]
        agg[k] = (...args: any[]) => {
          // @ts-ignore: ts doesn't think this is a function because of funky Visitor<T> type 
          oldVis(...args)
          // @ts-ignore
          vis[k](...args)
        }
      }
    })
    return agg
  }, {})
  traverse(ast, visitor)

  return [warnings, ast]
}

function stripAtFlowAnnotation(ast: File): File {
  let { leadingComments } = ast.program.body[0]
  if (leadingComments) {
    let index = leadingComments.findIndex(_ => _.value.trim() === '@flow')
    if (index > -1) {
      pullAt(leadingComments, index)
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
