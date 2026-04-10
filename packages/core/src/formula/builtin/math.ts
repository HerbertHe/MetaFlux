import { FormulaCategoryEnum } from "../../types/formula";
import type { IFormulaFunction, IFormulaCategory } from "../../types/formula";

export const ABS: IFormulaFunction = {
  name: "Absolute value",
  func: "ABS",
  description: [
    "Returns the absolute value of a number.",
    "Usage: `ABS`(number).",
    "Example: `ABS`(-8) returns 8.",
  ].join("\n"),
};

export const AVERAGE: IFormulaFunction = {
  name: "Average",
  func: "AVERAGE",
  description: [
    "Returns the arithmetic mean of a set of numbers.",
    "Usage: `AVERAGE`(number1, number2, ...).",
  ].join("\n"),
};

export const CEILING: IFormulaFunction = {
  name: "Ceiling",
  func: "CEILING",
  description: [
    "Rounds a number up to the nearest multiple of a given factor.",
    "Usage: `CEILING`(number, factor).",
    "Example: `CEILING`(7, 6) returns 12.",
  ].join("\n"),
};

export const COS: IFormulaFunction = {
  name: "Cosine",
  func: "COS",
  description: [
    "Returns the cosine of an angle in radians.",
    "Usage: `COS`(radians).",
    "Example: `COS`(`RADIANS`(60)) returns 0.5.",
  ].join("\n"),
};

export const COT: IFormulaFunction = {
  name: "Cotangent",
  func: "COT",
  description: [
    "Returns the cotangent of an angle in radians.",
    "Usage: `COT`(radians).",
    "Example: `COT`(`RADIANS`(45)) returns 1.",
  ].join("\n"),
};

export const FLOOR: IFormulaFunction = {
  name: "Floor",
  func: "FLOOR",
  description: [
    "Rounds a number down to the nearest multiple of a given factor.",
    "Usage: `FLOOR`(number, factor).",
    "Example: `FLOOR`(7, 6) returns 6.",
  ].join("\n"),
};

export const INT: IFormulaFunction = {
  name: "Integer part",
  func: "INT",
  description: [
    "Returns the integer part of a number.",
    "Usage: `INT`(number).",
    "Example: `INT`(3.1415) returns 3.",
  ].join("\n"),
};

export const LOG: IFormulaFunction = {
  name: "Logarithm",
  func: "LOG",
  description: [
    "Returns the logarithm of a number with a given base.",
    "Usage: `LOG`(number, base).",
    "Example: `LOG`(100, 10) returns 2.",
  ].join("\n"),
};

export const MAX: IFormulaFunction = {
  name: "Maximum",
  func: "MAX",
  description: [
    "Returns the largest value in a set of numbers.",
    "Usage: `MAX`(number1, number2, ...).",
  ].join("\n"),
};

export const MIN: IFormulaFunction = {
  name: "Minimum",
  func: "MIN",
  description: [
    "Returns the smallest value in a set of numbers.",
    "Usage: `MIN`(number1, number2, ...).",
  ].join("\n"),
};

export const MOD: IFormulaFunction = {
  name: "Modulo",
  func: "MOD",
  description: [
    "Returns the remainder of a division.",
    "Usage: `MOD`(dividend, divisor).",
    "Example: `MOD`(4, 3) returns 1.",
  ].join("\n"),
};

export const POWER: IFormulaFunction = {
  name: "Power",
  func: "POWER",
  description: [
    "Returns the result of a number raised to a power.",
    "Usage: `POWER`(number, exponent).",
    "Example: `POWER`(3, 2) returns 9.",
  ].join("\n"),
};

export const PRODUCT: IFormulaFunction = {
  name: "Product",
  func: "PRODUCT",
  description: [
    "Returns the product of a set of numbers.",
    "Usage: `PRODUCT`(number1, number2, ...).",
  ].join("\n"),
};

export const RADIANS: IFormulaFunction = {
  name: "Degrees to radians",
  func: "RADIANS",
  description: [
    "Converts degrees to radians.",
    "Usage: `RADIANS`(degrees).",
    "Example: `RADIANS`(180) returns 3.14159265.",
  ].join("\n"),
};

export const RAND: IFormulaFunction = {
  name: "Random number",
  func: "RAND",
  description: ["Returns a random number between 0 (inclusive) and 1 (exclusive).", "Usage: `RAND`()."].join(
    "\n",
  ),
};

export const ROUND: IFormulaFunction = {
  name: "Round",
  func: "ROUND",
  description: [
    "Rounds a number to a specified number of decimal places.",
    "Usage: `ROUND`(number, decimals).",
    "Example: `ROUND`(3.1485, 2) returns 3.15.",
  ].join("\n"),
};

export const SIN: IFormulaFunction = {
  name: "Sine",
  func: "SIN",
  description: [
    "Returns the sine of an angle in radians.",
    "Usage: `SIN`(radians).",
    "Example: `SIN`(`RADIANS`(30)) returns 0.5.",
  ].join("\n"),
};

export const SQRT: IFormulaFunction = {
  name: "Square root",
  func: "SQRT",
  description: [
    "Returns the positive square root of a number.",
    "Usage: `SQRT`(number).",
    "Example: `SQRT`(9) returns 3.",
  ].join("\n"),
};

export const SUM: IFormulaFunction = {
  name: "Sum",
  func: "SUM",
  description: [
    "Returns the sum of a set of numbers.",
    "Usage: `SUM`(number1, number2, ...).",
  ].join("\n"),
};

export const TAN: IFormulaFunction = {
  name: "Tangent",
  func: "TAN",
  description: [
    "Returns the tangent of an angle in radians.",
    "Usage: `TAN`(radians).",
    "Example: `TAN`(`RADIANS`(45)) returns 1.",
  ].join("\n"),
};

export default {
  category: FormulaCategoryEnum.Math,
  funcs: [
    ABS,
    AVERAGE,
    CEILING,
    COS,
    COT,
    FLOOR,
    INT,
    LOG,
    MAX,
    MIN,
    MOD,
    POWER,
    PRODUCT,
    RADIANS,
    RAND,
    ROUND,
    SIN,
    SQRT,
    SUM,
    TAN,
  ],
} as IFormulaCategory;

