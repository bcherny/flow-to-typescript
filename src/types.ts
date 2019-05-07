import { Node } from "@babel/types"

export type Warning = [string, string, number, number]

export type Visitor<T extends Node, K extends string = T["type"]> = { [key in K]: any }
export type Rule<T extends Node> = (warnings: Warning[]) => Visitor<T>

export type CompileResult = {
  inputAst: Node
  outputAst: Node
  code: string
  warnings: Warning[]
}
