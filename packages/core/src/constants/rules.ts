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

type RuleResultMethodsType = {
  label: string;
  value: ModuleRuleResultMethodEnum;
}[];

export const WidgetSupportedRuleConditionMethods: RuleConditionMethodsType = {
  Input: [
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ],
      value: ModuleRuleConditionMethodEnum.EQ,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE],
      value: ModuleRuleConditionMethodEnum.NE,
    },
  ],
  NumberInput: [
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ],
      value: ModuleRuleConditionMethodEnum.EQ,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE],
      value: ModuleRuleConditionMethodEnum.NE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LT],
      value: ModuleRuleConditionMethodEnum.LT,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GT],
      value: ModuleRuleConditionMethodEnum.GT,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LTE],
      value: ModuleRuleConditionMethodEnum.LTE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GTE],
      value: ModuleRuleConditionMethodEnum.GTE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.RANGE],
      value: ModuleRuleConditionMethodEnum.RANGE,
    },
  ],
  Date: [
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ],
      value: ModuleRuleConditionMethodEnum.EQ,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE],
      value: ModuleRuleConditionMethodEnum.NE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LT],
      value: ModuleRuleConditionMethodEnum.LT,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GT],
      value: ModuleRuleConditionMethodEnum.GT,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.LTE],
      value: ModuleRuleConditionMethodEnum.LTE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.GTE],
      value: ModuleRuleConditionMethodEnum.GTE,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.RANGE],
      value: ModuleRuleConditionMethodEnum.RANGE,
    },
  ],
  Select: [
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ],
      value: ModuleRuleConditionMethodEnum.EQ,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE],
      value: ModuleRuleConditionMethodEnum.NE,
    },
    {
      label: "Any of Choice",
      value: ModuleRuleConditionMethodEnum.IN,
    },
  ],
  Radio: [
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.EQ],
      value: ModuleRuleConditionMethodEnum.EQ,
    },
    {
      label: ConditionMethodsDefaultLabel[ModuleRuleConditionMethodEnum.NE],
      value: ModuleRuleConditionMethodEnum.NE,
    },
    {
      label: "Any of Choice",
      value: ModuleRuleConditionMethodEnum.IN,
    },
  ],
};

export const WidgetSupportedRuleResultMethods: RuleResultMethodsType = [
  {
    label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.Hide],
    value: ModuleRuleResultMethodEnum.Hide,
  },
  {
    label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.ReadOnly],
    value: ModuleRuleResultMethodEnum.ReadOnly,
  },
  {
    label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.Writeable],
    value: ModuleRuleResultMethodEnum.Writeable,
  },
  {
    label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.SetValue],
    value: ModuleRuleResultMethodEnum.SetValue,
  },
  {
    label: ResultMethodsDefaultLabel[ModuleRuleResultMethodEnum.SetOptions],
    value: ModuleRuleResultMethodEnum.SetOptions,
  },
];
