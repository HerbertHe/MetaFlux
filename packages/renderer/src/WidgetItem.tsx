import { DatePicker, Form, Input, Selector, Picker, Space } from "antd-mobile";
import type { FormInstance } from "rc-field-form";
import type { PickerValue } from "antd-mobile/es/components/picker";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { FC } from "react";

import type {
  IFuncData,
  IWidget,
  ValuesByWidgetId,
} from "@metaflux/core";
import { ModuleRuleResultMethodEnum } from "@metaflux/core";

type CustomRadioValue = { preValue: string; realValue: string };

export interface WidgetItemProps {
  form: FormInstance;
  widget: IWidget & { effect?: `${ModuleRuleResultMethodEnum}` };
  value: ValuesByWidgetId[string];
  contextVariables: Record<string, string>;
  formulaCalculator: (formula: string, context: Record<string, string>) => any;
}

type Validator = (rule: any, value: any) => Promise<void>;

function buildRegexValidator(funcList?: IFuncData[]): Validator | undefined {
  if (!funcList || funcList.length === 0) return undefined;
  return async (_rule: any, val: unknown) => {
    const s = typeof val === "string" ? val : "";
    const errors = funcList
      .map(({ func, message }) => {
        const regexp = new RegExp(func);
        return regexp.test(s) ? undefined : message;
      })
      .filter(Boolean) as string[];
    if (errors.length > 0) throw new Error(errors.join(", "));
  };
}

export const WidgetItem: FC<WidgetItemProps> = ({
  form,
  widget,
  contextVariables,
  formulaCalculator,
}) => {
  const isHidden = widget.effect === ModuleRuleResultMethodEnum.Hide;
  if (isHidden) return null;

  const readOnly =
    widget.effect === ModuleRuleResultMethodEnum.ReadOnly;

  const validator = useMemo(() => buildRegexValidator(widget.funcList), [widget.funcList]);

  const rules = [
    { required: true, message: `${widget.label}` },
    ...(validator ? [{ validator }] : []),
  ] as any[];

  switch (widget.widgetType) {
    case "Input": {
      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules}>
          <Input placeholder={widget.placeholder} disabled={readOnly} />
        </Form.Item>
      );
    }
    case "NumberInput": {
      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules}>
          <Input type="number" min={0} placeholder={widget.placeholder} disabled={readOnly} />
        </Form.Item>
      );
    }
    case "Radio": {
      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules}>
          <Selector
            showCheckMark={false}
            disabled={readOnly}
            options={(widget.options ?? []).map((o) => ({ label: o.label, value: o.value }))}
          />
        </Form.Item>
      );
    }
    case "Checkbox": {
      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules}>
          <Selector
            multiple
            showCheckMark
            disabled={readOnly}
            options={(widget.options ?? []).map((o) => ({ label: o.label, value: o.value }))}
          />
        </Form.Item>
      );
    }
    case "Select": {
      const columns = [
        (widget.options ?? []).map((o) => ({ label: o.label, value: o.value })),
      ];
      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules}>
          <MobilePickerField
            form={form}
            name={widget.widgetId}
            disabled={readOnly}
            columns={columns}
          />
        </Form.Item>
      );
    }
    case "Date": {
      const [min, max] = (() => {
        try {
          const info = widget.extendInfo ? JSON.parse(widget.extendInfo) : null;
          const range = info?.range as [string, string] | undefined;
          if (!range) return [undefined, undefined] as const;
          const minVal = range[0] ? String(formulaCalculator(range[0], contextVariables)) : "";
          const maxVal = range[1] ? String(formulaCalculator(range[1], contextVariables)) : "";
          return [
            minVal ? dayjs(minVal) : undefined,
            maxVal ? dayjs(maxVal) : undefined,
          ] as const;
        } catch {
          return [undefined, undefined] as const;
        }
      })();

      const minDate = min ? min.toDate() : undefined;
      const maxDate = max ? max.toDate() : undefined;

      return (
        <Form.Item name={widget.widgetId} label={widget.label} rules={rules} trigger="onConfirm">
          <DatePicker min={minDate} max={maxDate}>
            {(v: Date | null) => (
              <span style={{ color: v ? undefined : "#999" }}>
                {v ? dayjs(v).format("YYYY-MM-DD") : "请选择日期"}
              </span>
            )}
          </DatePicker>
        </Form.Item>
      );
    }
    case "CustomRadio": {
      const opts = (widget.options ?? []).map((o) => ({ label: o.label, value: o.value }));
      return (
        <CustomRadioItem
          form={form}
          widget={widget}
          options={opts}
          readOnly={readOnly}
        />
      );
    }
    default:
      return null;
  }
};

const CustomRadioItem: FC<{
  form: FormInstance;
  widget: IWidget & { effect?: `${ModuleRuleResultMethodEnum}` };
  options: { label: string; value: string }[];
  readOnly: boolean;
}> = ({ form, widget, options, readOnly }) => {
  const v = Form.useWatch(widget.widgetId, form) as CustomRadioValue | undefined;
  const isOther = v?.preValue === "other";

  return (
    <Form.Item
      name={widget.widgetId}
      label={widget.label}
      rules={[
        {
          validator: async (_rule: any, v2: CustomRadioValue | undefined) => {
            if (!v2?.preValue) throw new Error(`${widget.label}`);
          },
        },
      ]}
    >
      <div>
        <Selector
          showCheckMark={false}
          disabled={readOnly}
          options={[...options, { label: "其他", value: "other" }]}
          value={v?.preValue ? [v.preValue] : []}
          onChange={(arr: (string | number)[]) => {
            const preValue = (arr?.[0] as string) ?? "";
            form.setFieldValue(widget.widgetId, {
              preValue,
              realValue: preValue === "other" ? (v?.realValue ?? "") : preValue,
            } satisfies CustomRadioValue);
          }}
        />
        {isOther && (
          <Input
            placeholder="请输入其他值"
            disabled={readOnly}
            value={v?.realValue ?? ""}
            onChange={(e: string) => {
              form.setFieldValue(widget.widgetId, {
                preValue: "other",
                realValue: e,
              } satisfies CustomRadioValue);
            }}
          />
        )}
      </div>
    </Form.Item>
  );
};

const MobilePickerField: FC<{
  form: FormInstance;
  name: string;
  disabled: boolean;
  columns: { label: string; value: string }[][];
}> = ({ form, name, disabled, columns }) => {
  const [visible, setVisible] = useState(false);
  const v = (Form.useWatch(name, form) as string[] | string | undefined) ?? undefined;
  const display = Array.isArray(v) ? v[0] : v;

  return (
    <>
      <Space onClick={() => !disabled && setVisible(true)} style={{ color: display ? undefined : "#999" }}>
        {display
          ? columns[0].find((c) => c.value === display)?.label ?? display
          : "请选择"}
      </Space>
      <Picker
        visible={visible}
        columns={columns}
        value={display ? [display] : []}
        onClose={() => setVisible(false)}
        onConfirm={(val: PickerValue[]) => {
          const next = val?.[0];
          form.setFieldValue(name, next ?? "");
          setVisible(false);
        }}
      />
    </>
  );
};

