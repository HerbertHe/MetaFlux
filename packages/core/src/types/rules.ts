export enum ModuleRuleConditionMethodEnum {
  EQ = "eq",
  NE = "ne",
  LT = "lt",
  GT = "gt",
  LTE = "lte",
  GTE = "gte",
  RANGE = "range",
  IN = "in",
}

export type ModuleRuleConditionMethodType = `${ModuleRuleConditionMethodEnum}`;

export interface IModuleRuleCondition {
  sectionIndex: number;
  widgetId: string;
  method?: ModuleRuleConditionMethodType;
  values: string[];
}

export enum ModuleRuleResultMethodEnum {
  Hide = "hide",
  ReadOnly = "readonly",
  Writeable = "writeable",
  SetValue = "setValue",
  SetOptions = "setOptions",
}

export type ModuleRuleResultMethodType = `${ModuleRuleResultMethodEnum}`;

export interface IModuleRuleResult
  extends Omit<IModuleRuleCondition, "method"> {
  message?: string;
  method?: ModuleRuleResultMethodType;
}

export enum ModuleRuleRelationEnum {
  AND = "and",
  OR = "or",
}

export type ModuleRuleRelationType = `${ModuleRuleRelationEnum}`;

export interface IModuleRule {
  description: string;
  relation: ModuleRuleRelationType;
  conditions: IModuleRuleCondition[];
  results: IModuleRuleResult[];
}
