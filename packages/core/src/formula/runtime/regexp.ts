export const dateFormulaRegExp =
  /^\=\s*(\$[a-z]+)((?:\s*[\+\-]\s*[0-9]+[DY])+)?\s*$/g;

export const dateAddAndSubCaculationRegExp = /\s*([\+\-])\s*([0-9]+)([DY])/g;

export function isDateFormula(formula: string) {
  dateFormulaRegExp.lastIndex = 0;
  return dateFormulaRegExp.test(formula);
}

