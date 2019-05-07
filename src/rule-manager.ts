import { Node } from "@babel/types"
import { Rule } from "./types"

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

export const rules = new Map<string, Rule<any>>()

export function addRule<T extends Node = any>(ruleName: string, rule: Rule<T>) {
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
