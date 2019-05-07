import { Node } from "@babel/types"

declare global {
  type Warning = [string, string, number, number]

  type Visitor<T extends Node, K extends string = T["type"]> = { [key in K]: any }
  type Rule<T extends Node> = (warnings: Warning[]) => Visitor<T>

  type CompileResult = {
    inputAst: Node
    outputAst: Node
    code: string
    warnings: Warning[]
  }

  const rules: Map<string, Rule<any>>
  function addRule<T extends Node = any>(ruleName: string, rule: Rule<T>): void
}

const BabelTypes = require("@babel/types")
Object.values(BabelTypes.NODE_FIELDS)
  .map(types => Object.values(types))
  .filter(
    (fields: any) =>
      !!fields && (!!fields.validate || (Array.isArray(fields) && fields.some(field => !!field.validate)))
  )
  .forEach((fields: any) => {
    fields = Array.isArray(fields) ? fields : [fields]
    fields.forEach((field: any) => {
      field.validate = null
    })
  })

const rules = new Map<string, Rule<any>>()

function addRule<T extends Node = any>(ruleName: string, rule: Rule<T>) {
  if (rules.has(ruleName)) {
    throw `A rule with the name "${ruleName}" is already defined`
  }
  rules.set(ruleName, rule)
}

Object.assign(global, {
  addRule,
  rules
})

export {}
