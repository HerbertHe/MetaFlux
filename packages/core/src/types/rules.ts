export enum ModuleRuleConditionMethodEnum {
  /** equal to */
  EQ = "eq",
  /** not equal to */
  NE = "ne",
  /** less than */
  LT = "lt",
  /** greater than */
  GT = "gt",
  /** less than or equal to */
  LTE = "lte",
  /** greater than or equal to */
  GTE = "gte",
  /** range of values */
  RANGE = "range",
  /** equal to any of the values */
  IN = "in",
}

export type ModuleRuleConditionMethodType = `${ModuleRuleConditionMethodEnum}`;

export interface IModuleRuleCondition {
  categoryId: number;
  widgetId: string;
  method: ModuleRuleConditionMethodType;
  values: string[];
}

export enum ModuleRuleResultMethodEnum {
  // Show = "show",
  Hide = "hide",
  /** read-only */
  ReadOnly = "readonly",
  /** writeable */
  Writeable = "writeable",
  /** set the value */
  SetValue = "setValue",
  /** set the options */
  SetOptions = "setOptions",
}

export type ModuleRuleResultMethodType = `${ModuleRuleResultMethodEnum}`;

export interface IModuleRuleResult
  extends Omit<IModuleRuleCondition, "method"> {
  message: string;
  method: ModuleRuleResultMethodType;
}

export enum ModuleRuleRelationEnum {
  AND = "and",
  OR = "or",
}

export type ModuleRuleRelationType = `${ModuleRuleRelationEnum}`;

export interface IModuleRule {
  description: string;
  releation: ModuleRuleRelationType;
  conditions: IModuleRuleCondition[];
  results: IModuleRuleResult[];
}
