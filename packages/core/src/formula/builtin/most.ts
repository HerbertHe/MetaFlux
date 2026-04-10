import { FormulaCategoryEnum } from "../../types/formula";
import type { IFormulaCategory } from "../../types/formula";

import { SUM } from "./math";
import { CONCATENATE } from "./text";

export default {
  category: FormulaCategoryEnum.MostUsed,
  funcs: [CONCATENATE, SUM],
} as IFormulaCategory;

