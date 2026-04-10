import {
  parser,
  FormulaSyntaxError,
  type SupportedNodeType,
  type ISyntaxError,
} from "unist-formula-ast";
import { visit } from "unist-util-visit";

export const validateSupportedFunctions = (
  formula: string,
  funcs: string[],
) => {
  const errors: ISyntaxError[] = [];
  try {
    const tree = parser.parse(formula) as SupportedNodeType;

    visit(tree, (node) => {
      if (
        node.type === "Function" &&
        !!node.data &&
        !funcs.includes(node.data as string)
      ) {
        errors.push({
          name: "Unsupported Function",
          message: `${node.data}`,
          location: JSON.parse(JSON.stringify(node.position)),
        });
      }
    });

    return errors;
  } catch (err: any) {
    if (err instanceof FormulaSyntaxError) {
      return [];
    }

    return [
      {
        name: "Error",
        message: `${JSON.stringify(err)}`,
      },
    ] as ISyntaxError[];
  }
};
