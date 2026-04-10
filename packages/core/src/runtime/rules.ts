import type { IWidget, SupportedWidgetType } from "../types/widgets";
import {
  ModuleRuleConditionMethodEnum,
  ModuleRuleRelationEnum,
  ModuleRuleResultMethodEnum,
  type IModuleRule,
  type ModuleRuleConditionMethodType,
} from "../types/rules";
import type { RuntimeValue, RuntimeWidget, ValuesByWidgetId } from "./types";

function toStringArray(value: RuntimeValue, widgetType: SupportedWidgetType) {
  if (value == null) return [];
  if (widgetType === "CustomRadio") {
    if (typeof value === "object" && !Array.isArray(value)) {
      return value.realValue ? [value.realValue] : [];
    }
  }
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string");
  if (typeof value === "string") return [value];
  return [];
}

function toNumber(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toTime(value: string | undefined) {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}

function evalCondition(
  method: ModuleRuleConditionMethodType | undefined,
  widgetType: SupportedWidgetType,
  rawValue: RuntimeValue,
  values: string[],
) {
  if (!method) return false;
  const v = toStringArray(rawValue, widgetType);
  if (v.length === 0) return false;

  switch (widgetType) {
    case "NumberInput": {
      const left = toNumber(v[0]);
      const right0 = toNumber(values[0]);
      const right1 = toNumber(values[1]);
      if (left == null) return false;
      switch (method) {
        case ModuleRuleConditionMethodEnum.EQ:
          return right0 != null && left === right0;
        case ModuleRuleConditionMethodEnum.NE:
          return right0 != null && left !== right0;
        case ModuleRuleConditionMethodEnum.GT:
          return right0 != null && left > right0;
        case ModuleRuleConditionMethodEnum.GTE:
          return right0 != null && left >= right0;
        case ModuleRuleConditionMethodEnum.LT:
          return right0 != null && left < right0;
        case ModuleRuleConditionMethodEnum.LTE:
          return right0 != null && left <= right0;
        case ModuleRuleConditionMethodEnum.RANGE:
          return right0 != null && right1 != null && left >= right0 && left <= right1;
        case ModuleRuleConditionMethodEnum.IN:
          return values.map(toNumber).filter((x): x is number => x != null).includes(left);
        default:
          return false;
      }
    }
    case "Date": {
      const left = toTime(v[0]);
      const right0 = toTime(values[0]);
      const right1 = toTime(values[1]);
      if (left == null) return false;
      switch (method) {
        case ModuleRuleConditionMethodEnum.EQ:
        case ModuleRuleConditionMethodEnum.IN:
          return values.includes(v[0]);
        case ModuleRuleConditionMethodEnum.NE:
          return !values.includes(v[0]);
        case ModuleRuleConditionMethodEnum.GT:
          return right0 != null && left > right0;
        case ModuleRuleConditionMethodEnum.GTE:
          return right0 != null && left >= right0;
        case ModuleRuleConditionMethodEnum.LT:
          return right0 != null && left < right0;
        case ModuleRuleConditionMethodEnum.LTE:
          return right0 != null && left <= right0;
        case ModuleRuleConditionMethodEnum.RANGE:
          return right0 != null && right1 != null && left >= right0 && left <= right1;
        default:
          return false;
      }
    }
    default: {
      const left = v[0];
      switch (method) {
        case ModuleRuleConditionMethodEnum.EQ:
        case ModuleRuleConditionMethodEnum.IN:
          return values.includes(left);
        case ModuleRuleConditionMethodEnum.NE:
          return !values.includes(left);
        default:
          return false;
      }
    }
  }
}

function cloneWidgets(widgets: IWidget[][]) {
  return JSON.parse(JSON.stringify(widgets)) as RuntimeWidget[][];
}

export type ApplyRulesInput = {
  widgets: IWidget[][];
  rules: IModuleRule[];
  valuesByWidgetId: ValuesByWidgetId;
};

export type ApplyRulesOutput = {
  widgets: RuntimeWidget[][];
  valuesByWidgetId: ValuesByWidgetId;
};

/**
 * 将规则作用到 widgets 上（Hide / ReadOnly / Writeable / SetValue / SetOptions）。
 * 规则命中时，后出现的规则会覆盖同一控件的先前 effect。
 */
export function applyRules({
  widgets,
  rules,
  valuesByWidgetId,
}: ApplyRulesInput): ApplyRulesOutput {
  const nextWidgets = cloneWidgets(widgets);
  const nextValues: ValuesByWidgetId = { ...valuesByWidgetId };

  const widgetMap = new Map<string, RuntimeWidget>();
  nextWidgets.flat().forEach((w) => widgetMap.set(w.widgetId, w));

  for (const rule of rules) {
    const relation =
      rule.relation === ModuleRuleRelationEnum.OR
        ? ModuleRuleRelationEnum.OR
        : ModuleRuleRelationEnum.AND;

    const matched =
      relation === ModuleRuleRelationEnum.AND
        ? rule.conditions.every((c) => {
            const w = widgetMap.get(c.widgetId);
            if (!w) return false;
            return evalCondition(
              c.method,
              w.widgetType,
              nextValues[w.widgetId],
              c.values,
            );
          })
        : rule.conditions.some((c) => {
            const w = widgetMap.get(c.widgetId);
            if (!w) return false;
            return evalCondition(
              c.method,
              w.widgetType,
              nextValues[w.widgetId],
              c.values,
            );
          });

    if (!matched) continue;

    for (const r of rule.results) {
      const w = widgetMap.get(r.widgetId);
      if (!w) continue;

      const method = r.method as `${ModuleRuleResultMethodEnum}` | undefined;
      if (!method) continue;

      w.effect = method;

      if (method === ModuleRuleResultMethodEnum.SetOptions) {
        const allowed = new Set(r.values ?? []);
        w.options = (w.options ?? []).filter((o) => allowed.has(o.value));
        const cur = toStringArray(nextValues[w.widgetId], w.widgetType);
        if (cur[0] && !allowed.has(cur[0])) {
          nextValues[w.widgetId] = [];
        }
      }

      if (method === ModuleRuleResultMethodEnum.SetValue) {
        nextValues[w.widgetId] = r.values ?? [];
      }
    }
  }

  return { widgets: nextWidgets, valuesByWidgetId: nextValues };
}

