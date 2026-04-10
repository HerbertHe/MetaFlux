import { useEffect, useMemo, useState } from "react";
import type { FC, ReactNode } from "react";
import { Form } from "antd-mobile";
import type { FormInstance } from "rc-field-form";

import type { IModuleRule, IWidget } from "@metaflux/core";
import { applyRules, formulaCalculator, type ValuesByWidgetId } from "@metaflux/core";
import { WidgetItem } from "./WidgetItem";
import styles from "./styles/renderer.less";

export type FormRendererValues = ValuesByWidgetId;

export interface FormRendererProps {
  sections: string[];
  widgets: IWidget[][];
  rules?: IModuleRule[];
  initialValues?: FormRendererValues;
  onValuesChange?: (values: FormRendererValues) => void;
  headerRender?: (sectionIndex: number, sectionTitle: string) => ReactNode;
  form?: FormInstance;
}

function getDefaultSectionTitle(idx: number) {
  return `Section ${idx + 1}`;
}

export const FormRenderer: FC<FormRendererProps> = ({
  sections,
  widgets,
  rules = [],
  initialValues = {},
  onValuesChange,
  headerRender,
  form,
}) => {
  const [internalForm] = Form.useForm();
  const usedForm = form ?? internalForm;

  const [valuesByWidgetId, setValuesByWidgetId] = useState<FormRendererValues>(
    initialValues,
  );

  const { renderedWidgets, normalizedValues } = useMemo(() => {
    const { widgets: w, valuesByWidgetId: v } = applyRules({
      widgets,
      rules,
      valuesByWidgetId,
    });
    return { renderedWidgets: w, normalizedValues: v };
  }, [widgets, rules, valuesByWidgetId]);

  useEffect(() => {
    setValuesByWidgetId(initialValues);
  }, [initialValues]);

  useEffect(() => {
    // keep internal state aligned with rule side-effects (SetValue/SetOptions)
    if (normalizedValues !== valuesByWidgetId) {
      setValuesByWidgetId(normalizedValues);
      onValuesChange?.(normalizedValues);
    }

    // sync antd form fields for visible widgets
    const nextFormVals: Record<string, any> = {};
    renderedWidgets.flat().forEach((w) => {
      const v = normalizedValues[w.widgetId];
      nextFormVals[w.widgetId] = v;
    });
    usedForm.setFieldsValue(nextFormVals);
  }, [renderedWidgets, normalizedValues]);

  const contextVariables = useMemo(() => {
    // provide formula calculator with { fieldKey: value }
    const map: Record<string, string> = {};
    renderedWidgets.flat().forEach((w) => {
      const raw = normalizedValues[w.widgetId];
      if (typeof raw === "string") map[w.fieldKey] = raw;
      if (Array.isArray(raw) && typeof raw[0] === "string") map[w.fieldKey] = raw[0];
      if (raw && typeof raw === "object" && !Array.isArray(raw)) map[w.fieldKey] = raw.realValue;
    });
    return map;
  }, [renderedWidgets, normalizedValues]);

  return (
    <div className={styles["metaflux-renderer"]}>
      <Form
        form={usedForm}
        onValuesChange={(changed) => {
          const next = { ...valuesByWidgetId, ...changed } as FormRendererValues;
          setValuesByWidgetId(next);
          onValuesChange?.(next);
        }}
      >
        {renderedWidgets.map((sectionWidgets, idx) => {
          const title = sections[idx] ?? getDefaultSectionTitle(idx);
          return (
            <div key={idx}>
              {headerRender ? (
                headerRender(idx, title)
              ) : (
                <div className={styles["metaflux-renderer__sectionTitle"]}>
                  {title}
                </div>
              )}
              {sectionWidgets.map((w) => (
                <WidgetItem
                  key={w.widgetId}
                  form={usedForm}
                  widget={w}
                  value={valuesByWidgetId[w.widgetId]}
                  contextVariables={contextVariables}
                  formulaCalculator={formulaCalculator}
                />
              ))}
            </div>
          );
        })}
      </Form>
    </div>
  );
};

