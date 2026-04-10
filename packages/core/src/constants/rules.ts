import {
  ModuleRuleConditionMethodEnum,
  ModuleRuleResultMethodEnum,
} from "../types";
import type { SupportedWidgetType } from "../types/widgets";

const ConditionMethodsDefaultLabel: Record<
  ModuleRuleConditionMethodEnum,
  string
> = {
  [ModuleRuleConditionMethodEnum.EQ]: "Equal To",
  [ModuleRuleConditionMethodEnum.NE]: "Not Equal To",
  [ModuleRuleConditionMethodEnum.LT]: "Less Than",
  [ModuleRuleConditionMethodEnum.GT]: "Greater Than",
  [ModuleRuleConditionMethodEnum.LTE]: "Less Than or Equal To",
  [ModuleRuleConditionMethodEnum.GTE]: "Greater Than or Equal To",
  [ModuleRuleConditionMethodEnum.RANGE]: "Between",
  [ModuleRuleConditionMethodEnum.IN]: "In",
};

const ResultMethodsDefaultLabel: Record<ModuleRuleResultMethodEnum, string> = {
  [ModuleRuleResultMethodEnum.Hide]: "Hide",
  [ModuleRuleResultMethodEnum.ReadOnly]: "Set to Read-Only",
  [ModuleRuleResultMethodEnum.Writeable]: "Set to Writeable",
  [ModuleRuleResultMethodEnum.SetValue]: "Set Value",
  [ModuleRuleResultMethodEnum.SetOptions]: "Set Options",
};

type RuleConditionMethodsType = Record<
  SupportedWidgetType,
  {
    label: string;
    value: ModuleRuleConditionMethodEnum;
  }[]
>;

interface RuleResultMethodsTypeItem {
  label: string;
  value: ModuleRuleResultMethodEnum;
}

type RuleResultMethodsType = RuleResultMethodsTypeItem[];

export const ConditionMethodDisplayMap = ConditionMethodsDefaultLabel;

export const InputRuleConditionMethods = [
  { value: ModuleRuleConditionMethodEnum.EQ, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ] },
  { value: ModuleRuleConditionMethodEnum.NE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE] },
];

export const NumberInputRuleConditionMethods = [
  { value: ModuleRuleConditionMethodEnum.EQ, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ] },
  { value: ModuleRuleConditionMethodEnum.NE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE] },
  { value: ModuleRuleConditionMethodEnum.LT, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LT] },
  { value: ModuleRuleConditionMethodEnum.GT, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GT] },
  { value: ModuleRuleConditionMethodEnum.LTE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LTE] },
  { value: ModuleRuleConditionMethodEnum.GTE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GTE] },
  { value: ModuleRuleConditionMethodEnum.RANGE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.RANGE] },
];

export const DateRuleConditionMethods = NumberInputRuleConditionMethods;

export const SelectRuleConditionMethods = [
  { value: ModuleRuleConditionMethodEnum.EQ, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ] },
  { value: ModuleRuleConditionMethodEnum.NE, label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE] },
  { value: ModuleRuleConditionMethodEnum.IN, label: "Any of Choice" },
];

export const WidgetSupportedRuleConditionMethods: RuleConditionMethodsType = {
  Input: InputRuleConditionMethods,
  NumberInput: NumberInputRuleConditionMethods,
  Date: DateRuleConditionMethods,
  Select: SelectRuleConditionMethods,
  Radio: SelectRuleConditionMethods,
  Checkbox: SelectRuleConditionMethods,
  CustomRadio: SelectRuleConditionMethods,
};

export const WidgetSupportedRuleResultMethods: RuleResultMethodsType = [
  { label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.Hide], value: ModuleRuleResultMethodEnum.Hide },
  { label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.ReadOnly], value: ModuleRuleResultMethodEnum.ReadOnly },
  { label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.Writeable], value: ModuleRuleResultMethodEnum.Writeable },
  { label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.SetValue], value: ModuleRuleResultMethodEnum.SetValue },
  { label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.SetOptions], value: ModuleRuleResultMethodEnum.SetOptions },
];

export function getConditionMethodsForWidget(widgetType: SupportedWidgetType) {
  return WidgetSupportedRuleConditionMethods[widgetType] || [];
}

export function getResultMethodsForWidget(widgetType: SupportedWidgetType) {
  const hasOptions: SupportedWidgetType[] = ["Select", "Radio", "Checkbox", "CustomRadio"];
  if (hasOptions.includes(widgetType)) {
    return WidgetSupportedRuleResultMethods;
  }
  return WidgetSupportedRuleResultMethods.filter(
    (m) => m.value !== ModuleRuleResultMethodEnum.SetOptions,
  );
}
