import { FormulaCategoryEnum } from "../../types/formula";
import type { IFormulaFunction, IFormulaCategory } from "../../types/formula";

export const CONCATENATE: IFormulaFunction = {
  name: "Concatenate texts",
  func: "CONCATENATE",
  description: [
    "Joins multiple text strings into one.",
    "Usage: `CONCATENATE`(text1, text2, ...).",
  ].join("\n"),
};

export const CHAR: IFormulaFunction = {
  name: "Character from code",
  func: "CHAR",
  description: [
    "Converts a character code to its corresponding character.",
    "Usage: `CHAR`(number).",
    "Example: `CHAR`(100) returns character d.",
  ].join("\n"),
};

export const EXACT: IFormulaFunction = {
  name: "Compare text equality",
  func: "EXACT",
  description: [
    "Compares two texts for exact match; returns true if identical, false otherwise.",
    "Usage: `EXACT`(text1, text2).",
  ].join("\n"),
};

export const LEFT: IFormulaFunction = {
  name: "Left characters",
  func: "LEFT",
  description: [
    "Returns the specified number of characters from the start of a text.",
    "Usage: `LEFT`(text, length).",
    "Example: `LEFT`(\"Hello World\", 5) returns \"Hello\".",
  ].join("\n"),
};

export const LEN: IFormulaFunction = {
  name: "Character count",
  func: "LEN",
  description: [
    "Returns the number of characters in a text.",
    "Usage: `LEN`(text).",
    "Example: `LEN`(\"Hello\") returns 5.",
  ].join("\n"),
};

export const LOWER: IFormulaFunction = {
  name: "To lowercase",
  func: "LOWER",
  description: [
    "Converts all uppercase letters to lowercase.",
    "Usage: `LOWER`(text).",
    "Example: `LOWER`(\"HELLO\") returns \"hello\".",
  ].join("\n"),
};

export const MID: IFormulaFunction = {
  name: "Mid characters",
  func: "MID",
  description: [
    "Returns characters from the middle of a text, starting at the given position.",
    "Usage: `MID`(text, start, count).",
    "Example: `MID`(\"Hello World\", 7, 5) returns \"World\".",
  ].join("\n"),
};

export const REPLACE: IFormulaFunction = {
  name: "Replace text",
  func: "REPLACE",
  description: [
    "Replaces part of a text with a new text.",
    "Usage: `REPLACE`(text, start, length, new_text).",
    "Example: `REPLACE`(\"Hello\", 1, 5, \"World\") returns \"World\".",
  ].join("\n"),
};

export const REPT: IFormulaFunction = {
  name: "Repeat text",
  func: "REPT",
  description: [
    "Repeats a text a specified number of times.",
    "Usage: `REPT`(text, count).",
    "Example: `REPT`(\"ab\", 3) returns \"ababab\".",
  ].join("\n"),
};

export const RIGHT: IFormulaFunction = {
  name: "Right characters",
  func: "RIGHT",
  description: [
    "Returns the specified number of characters from the end of a text.",
    "Usage: `RIGHT`(text, length).",
    "Example: `RIGHT`(\"Hello World\", 5) returns \"World\".",
  ].join("\n"),
};

export const SEARCH: IFormulaFunction = {
  name: "Search text position",
  func: "SEARCH",
  description: [
    "Returns the position of a text within another text.",
    "Usage: `SEARCH`(find_text, within_text).",
    "Example: `SEARCH`(\"World\", \"Hello World\") returns 7.",
  ].join("\n"),
};

export const SPLIT: IFormulaFunction = {
  name: "Split text",
  func: "SPLIT",
  description: [
    "Splits a text into an array by a delimiter.",
    "Usage: `SPLIT`(text, delimiter).",
    "Example: `SPLIT`(\"a-b-c\", \"-\") returns [\"a\", \"b\", \"c\"].",
  ].join("\n"),
};

export const TRIM: IFormulaFunction = {
  name: "Trim whitespace",
  func: "TRIM",
  description: [
    "Removes leading and trailing whitespace from a text.",
    "Usage: `TRIM`(text).",
    "Example: `TRIM`(\" Hello \") returns \"Hello\".",
  ].join("\n"),
};

export const UPPER: IFormulaFunction = {
  name: "To uppercase",
  func: "UPPER",
  description: [
    "Converts all lowercase letters to uppercase.",
    "Usage: `UPPER`(text).",
    "Example: `UPPER`(\"hello\") returns \"HELLO\".",
  ].join("\n"),
};

export default {
  category: FormulaCategoryEnum.Text,
  funcs: [
    CONCATENATE,
    CHAR,
    EXACT,
    LEFT,
    LEN,
    LOWER,
    MID,
    REPLACE,
    REPT,
    RIGHT,
    SEARCH,
    SPLIT,
    TRIM,
    UPPER,
  ],
} as IFormulaCategory;

