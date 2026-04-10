import { useEffect, useState } from "react";
import type { FC, CSSProperties } from "react";
import { Input, InputNumber, Space } from "antd";
import { useTranslation } from "react-i18next";
import { DRAWER_I18N_NS } from "../../../i18n";

export interface NumberRangeItemProps {
  className?: string;
  style?: CSSProperties;
  value?: string[];
  onChange?: (val: any) => void;
  unit?: string;
}

const NumberRangeItem: FC<NumberRangeItemProps> = (props) => {
  const { onChange, unit } = props;
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [value, setValue] = useState<any>();

  function handleMinChange(num: any) {
    const newValue = value ? [...value] : [null, null];
    newValue[0] = num;
    const isEmpty = newValue.every((item: any) => item === null);
    onChange?.(isEmpty ? undefined : newValue);
    setValue(isEmpty ? undefined : newValue);
  }

  function handleMaxChange(num: any) {
    const newValue = value ? [...value] : [null, null];
    newValue[1] = num;
    const isEmpty = newValue.every((item: any) => item === null);
    onChange?.(isEmpty ? undefined : newValue);
    setValue(isEmpty ? undefined : newValue);
  }

  useEffect(() => {
    if ("value" in props) {
      setValue(props.value || []);
    }
  }, [props.value]);

  return (
    <Space.Compact>
      <InputNumber
        style={{ width: 100, textAlign: "center", position: "relative", zIndex: 1 }}
        placeholder={t("min")}
        value={value?.[0]}
        onChange={handleMinChange}
        max={value?.[1]}
        min={0}
      />
      <Input
        style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: "none" }}
        placeholder="~"
        disabled
      />
      <InputNumber
        style={{ width: 100, textAlign: "center" }}
        placeholder={t("max")}
        value={value?.[1]}
        min={value?.[0]}
        onChange={handleMaxChange}
      />
      {unit && (
        <Input
          style={{ width: 40, pointerEvents: "none" }}
          placeholder={unit}
          disabled
        />
      )}
    </Space.Compact>
  );
};

export default NumberRangeItem;
