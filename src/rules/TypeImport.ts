import { importDeclaration } from "@babel/types"

addRule("TypeImport", () => ({
  ImportDeclaration(path: any) {
    if ((path as any).node.importKind === "type") {
      path.replaceWith(importDeclaration(path.node.specifiers, path.node.source))
    }
  }
}))
