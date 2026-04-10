import {
  parser,
  FormulaSyntaxError,
  type SupportedNodeType,
  type ISyntaxError,
} from "unist-formula-ast";
import { visit } from "unist-util-visit";
import type { IContextSectionVariables } from "../../types/context";

export const validateContextVariables = (
  formula: string,
  contextVariables: IContextSectionVariables[],
) => {
  const errors: ISyntaxError[] = [];
  try {
    const tree = parser.parse(formula) as SupportedNodeType;
    const variables = contextVariables
      .map((v) => v.variables)
      .flat()
      .map((v) => `$${v.variable}`);

    visit(tree, (node) => {
      if (
        node.type === "Variable" &&
        !!node.data &&
        !variables.includes(node.data as string)
      ) {
        errors.push({
          name: "Invalid variable",
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
