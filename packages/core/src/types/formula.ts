export enum FormulaCategoryEnum {
  MostUsed = "Most Used",
  Math = "Math",
  Text = "Text",
  Logical = "Logical",
  Date = "Date",
}

export interface IFormulaFunction {
  name: string;
  func: string;
  description: string;
}

export interface IFormulaCategory {
  category: FormulaCategoryEnum;
  funcs: IFormulaFunction[];
}

export type FormulaCategoriesType = IFormulaCategory[];
