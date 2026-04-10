import type { IWidget } from "../types/widgets";
import type {
  IModuleRule,
  ModuleRuleResultMethodEnum,
  ModuleRuleConditionMethodEnum,
  ModuleRuleRelationEnum,
} from "../types/rules";

export type RuntimeValue =
  | string
  | string[]
  | { preValue: string; realValue: string }
  | undefined
  | null;

export type ValuesByWidgetId = Record<string, RuntimeValue>;

export type RuntimeWidget = IWidget & {
  effect?: `${ModuleRuleResultMethodEnum}`;
};

export type RuntimeModule = {
  sectionIndex: number;
  section?: string;
  widgets: RuntimeWidget[];
};

export type { IModuleRule };
export {
  ModuleRuleResultMethodEnum,
  ModuleRuleConditionMethodEnum,
  ModuleRuleRelationEnum,
};

