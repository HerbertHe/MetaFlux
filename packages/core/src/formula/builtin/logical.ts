import { FormulaCategoryEnum } from "../../types/formula";
import type { IFormulaFunction, IFormulaCategory } from "../../types/formula";

export const IF: IFormulaFunction = {
  name: "If condition",
  func: "IF",
  description: [
    "Evaluates a condition and returns one value if true, another if false.",
    "Usage: `IF`(condition, value_if_true, value_if_false).",
  ].join("\n"),
};

export default {
  category: FormulaCategoryEnum.Logical,
  funcs: [IF],
} as IFormulaCategory;

