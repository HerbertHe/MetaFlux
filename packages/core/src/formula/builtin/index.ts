import most from "./most";
import text from "./text";
import math from "./math";
import logical from "./logical";
import date from "./date";

export const funcs = [most, text, math, logical, date];

export const SUPPORTED_FUNCTIONS = funcs
  .map((f) => f.funcs)
  .flat()
  .map((f) => f.func);

export default funcs;

