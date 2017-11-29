import generate from '@babel/generator'
import traverse, { Node, Visitor } from 'babel-traverse'
import { parse } from 'babylon'

let Visitor: Visitor<Node> = {
  TypeAnnotation(path) {
    console.log('TypeAnnotation', path)
  }
}

export function compile(code: string) {
  let ast = parse(code, { plugins: ['flow', 'objectRestSpread'] })
  console.log('ast', ast)
  traverse(ast, Visitor)
  return generate(ast)
}
