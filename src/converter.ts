import "./rule-manager"
import "./nodes"
import { parse } from "@babel/parser"
import generate from "@babel/generator"
import traverse from "@babel/traverse"
import { Node } from "@babel/types"
import { File } from "@babel/types"
import { sync } from "glob"
import { dropWhile, pullAt } from "lodash"
import { EOL } from "os"
import { relative, resolve } from "path"

/**
 * Compile code producing
 * [code, ast, warnings]
 * @param {string} code
 * @param {string} filename
 * @returns {Promise<[ast, warnings, code]>}
 */
export async function compile(code: string, filename: string): Promise<CompileResult> {
  const inputAst = parse(code, {
    plugins: [
      ["flow", { all: true }],
      ["decorators-legacy", { legacy: true }],
      ["classProperties", { loose: true }],
      //"classProperties",
      "jsx",
      "objectRestSpread",
      "optionalChaining",
      "importMeta",
      "doExpressions",
      "exportDefaultFrom",
      "exportNamespaceFrom",
      "dynamicImport",
      "functionBind",
      "functionSent",
      "asyncGenerators"
    ] as any,
    sourceType: "module"
  })

  const [warnings, ast] = await convert(inputAst)

  warnings.forEach(([message, issueURL, line, column]) => {
    console.log(
      `Warning: ${message} (at ${relative(__dirname, filename)}: line ${line}, column ${column}). See ${issueURL}`
    )
  })

  const result = generate(stripAtFlowAnnotation(ast))

  return {
    code: addTrailingSpace(trimLeadingNewlines(result.code)),
    inputAst,
    outputAst: ast,
    warnings
  }
}

/**
 * @internal
 */
export async function convert<T extends Node>(ast: T): Promise<[Warning[], T]> {
  // load rules directory
  await Promise.all(sync(resolve(__dirname, "./rules/*.js")).map(_ => import(_)))

  let warnings: Warning[] = []
  const ruleConfigs = [...rules.entries()]
  // @ts-ignore
  ruleConfigs.forEach(([_, visitor]) => {
    // console.info(`On rule: ${name}`)
    traverse(ast, visitor(warnings))
  })

  return [warnings, ast]
}

function stripAtFlowAnnotation(ast: File): File {
  const firstElement = ast.program.body[0]
  if (firstElement && firstElement.leadingComments) {
    let { leadingComments } = firstElement
    if (leadingComments) {
      let index = leadingComments.findIndex(_ => _.value.trim() === "@flow")
      if (index > -1) {
        pullAt(leadingComments, index)
      }
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
