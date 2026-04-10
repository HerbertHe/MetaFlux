import { Parser } from "hot-formula-parser";
import dayjs from "dayjs";
import {
  dateAddAndSubCaculationRegExp,
  dateFormulaRegExp,
  isDateFormula,
} from "./regexp";

function getUnit(unit: string) {
  switch (unit) {
    case "D":
      return "day";
    case "Y":
      return "year";
    default:
      return "";
  }
}

export type FormulaContextVariables = Record<string, string | undefined>;

/**
 * 支持：
 * - 日期简写公式：`=$today+7D-1Y`
 * - 通用公式：基于 hot-formula-parser（Excel-like），并支持自定义函数 TODAY / DATEDELTA
 * - 上下文变量：`$foo`，会被替换为对应字符串值
 */
export function formulaCalculator(
  formula: string,
  contextVariables: FormulaContextVariables = {},
) {
  if (!formula?.startsWith("=")) return formula;
  if (isDateFormula(formula)) return dateCalculator(formula);
  return normalCalculator(formula, contextVariables);
}

export function dateCalculator(formula: string) {
  dateFormulaRegExp.lastIndex = 0;
  const formulaExeced = dateFormulaRegExp.exec(formula);
  const variable = formulaExeced?.[1] ?? "";
  const calculation = formulaExeced?.[2];

  dateAddAndSubCaculationRegExp.lastIndex = 0;
  const calcArray = calculation?.match(dateAddAndSubCaculationRegExp) || [];

  let result = dayjs();
  switch (variable) {
    case "$today":
      result = dayjs();
      break;
    case "$yesterday":
      result = dayjs().subtract(1, "day");
      break;
    case "$tomorrow":
      result = dayjs().add(1, "day");
      break;
    default:
      result = dayjs();
      break;
  }

  for (let i = 0; i < calcArray.length; i++) {
    dateAddAndSubCaculationRegExp.lastIndex = 0;
    const [, flag, num, unit] =
      dateAddAndSubCaculationRegExp.exec(calcArray[i]) || [];
    const u = getUnit(unit);
    if (!u) continue;

    if (flag === "+") {
      result = result.add(Number(num), u);
    } else if (flag === "-") {
      result = result.subtract(Number(num), u);
    }
  }

  return result.format("YYYY-MM-DD");
}

function TODAY(args: any[]) {
  if (args.length > 0) throw new Error("TODAY() takes no arguments");
  return dayjs().format("YYYY-MM-DD");
}

function DATEDELTA(args: any[]) {
  if (args.length !== 3) throw new Error("DATEDELTA(date, delta, unit)");

  const [date, delta, unit] = args;
  if (
    !/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(date) ||
    typeof delta !== "number" ||
    !["year", "month", "day"].includes(unit)
  ) {
    throw new Error("Invalid DATEDELTA arguments");
  }

  if (delta > 0) return dayjs(date).add(delta, unit).format("YYYY-MM-DD");
  return dayjs(date).subtract(Math.abs(delta), unit).format("YYYY-MM-DD");
}

export function normalCalculator(
  formula: string,
  contextVariables: FormulaContextVariables,
) {
  const parser = new Parser();
  parser.setFunction("TODAY", (...args: any[]) => TODAY(args));
  parser.setFunction("DATEDELTA", (...args: any[]) => DATEDELTA(args));

  let formulaAfterHandled = formula;
  for (const [name, value] of Object.entries(contextVariables)) {
    const v = value
      ? isDateFormula(value)
        ? dateCalculator(value)
        : value.startsWith("=")
          ? value.slice(1)
          : value
      : "";
    formulaAfterHandled = formulaAfterHandled
      .split(`$${name}`)
      .join(`"${v}"`);
  }

  const result = parser.parse(formulaAfterHandled.slice(1));
  if (result.error) return result.error;
  return Array.isArray(result.result) ? result.result.join(",") : result.result;
}

