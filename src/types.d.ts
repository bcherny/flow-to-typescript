declare module 'stdin'

declare module '@babel/babylon'
declare module '@babel/generator'
declare module '@babel/traverse' {
  let traverse: any
  export default traverse
  export type Node = any
  export type Visitor<A> = any
}
