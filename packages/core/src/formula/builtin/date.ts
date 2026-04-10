import { FormulaCategoryEnum } from "../../types/formula";
import type { IFormulaCategory, IFormulaFunction } from "../../types/formula";

export const DAYS: IFormulaFunction = {
  name: "Days between dates",
  func: "DAYS",
  description: [
    "Returns the number of days between two dates.",
    "Usage: `DAYS`(date1, date2).",
    'Example: `DAYS`(\"2024-04-30\", \"2025-06-06\") returns -402.',
  ].join("\n"),
};

export const MONTH: IFormulaFunction = {
  name: "Get month",
  func: "MONTH",
  description: [
    "Returns the month of a date.",
    "Usage: `MONTH`(date).",
    'Example: `MONTH`(\"2024-04-30\") returns 4.',
  ].join("\n"),
};

export const DAY: IFormulaFunction = {
  name: "Day of month",
  func: "DAY",
  description: [
    "Returns the day of the month from a date.",
    "Usage: `DAY`(date).",
    'Example: `DAY`(\"2024-04-30\") returns 30.',
  ].join("\n"),
};

export const TODAY: IFormulaFunction = {
  name: "Today",
  func: "TODAY",
  description: ["Returns today's date.", "Usage: `TODAY`()."].join("\n"),
};

export const YEAR: IFormulaFunction = {
  name: "Get year",
  func: "YEAR",
  description: [
    "Returns the year from a date.",
    "Usage: `YEAR`(date).",
    'Example: `YEAR`(\"2024-04-30\") returns 2024.',
  ].join("\n"),
};

export const DATEDELTA: IFormulaFunction = {
  name: "Date delta",
  func: "DATEDELTA",
  description: [
    "Adds or subtracts a duration from a date.",
    "Usage: `DATEDELTA`(date, delta, unit).",
    'Units: \"day\", \"month\", \"year\".',
    'Example: `DATEDELTA`(\"2024-04-30\", 10, \"day\") returns 2024-05-10.',
  ].join("\n"),
};

export default {
  category: FormulaCategoryEnum.Date,
  funcs: [DAYS, DAY, MONTH, YEAR, TODAY, DATEDELTA],
} as IFormulaCategory;

