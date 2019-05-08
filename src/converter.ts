import "./rule-manager"
import "./nodes"
import { parse } from "@babel/parser"
import generate from "@babel/generator"
import traverse from "@babel/traverse"
import { FunctionDeclaration, Node } from "@babel/types"
import { File } from "@babel/types"
import { sync } from "glob"
import { dropWhile, pullAt } from "lodash"
import { EOL } from "os"
import { relative, resolve } from "path"
import { rules } from "./rule-manager"
import { CompileResult, Warning } from "./types"

/**
 * Compile code producing
 * [code, ast, warnings]
 * @param {string} code
 * @param {string} filename
 * @param dts
 * @returns {Promise<[ast, warnings, code]>}
 */
export async function compile(code: string, filename: string, dts: boolean = false): Promise<CompileResult> {
  let inputAst = parse(code, {
    plugins: [
      ["flow", { all: true }],
      ["decorators-legacy", { legacy: true }],
      ["classProperties", { loose: true }],
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

  if (dts) {
    inputAst = convertToDeclaration(inputAst)
  }

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

export function convertToDeclaration<T extends Node>(ast: T): T {
  traverse(ast, {
    ClassProperty(path) {
      if (path.node.value) {
        delete path.node.value
      }
    },
    ClassMethod(path) {
      if (path.node.body) {
        delete path.node.body
      }
    },
    FunctionDeclaration(path) {
      const node = path.node as FunctionDeclaration
      if (path.node.body) {
        delete path.node.body
      }

      if (node.params) {
        node.params = node.params.map(param => (param.type === "AssignmentPattern" ? param.left : param))
      }
    }
  })

  return ast
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
  const { body, directives } = ast.program
  if (directives) delete ast.program.directives

  const firstElement = body[0]
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
