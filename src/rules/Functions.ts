import { addRule } from "../";
import { toTs } from "../convert";

addRule("Functions", () => ({
  TypeAnnotation(path) {
    if (path.node.typeAnnotation.type === "FunctionTypeAnnotation") {
      console.log("OK?");
      path.replaceWith(toTs(path.node));
      console.log("OK!");
    }
  },
  FunctionTypeAnnotation(path) {
    path.replaceWith(toTs(path.node));
  },
}));
