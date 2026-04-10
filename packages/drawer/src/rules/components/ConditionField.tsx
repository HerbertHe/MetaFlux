import type { FC } from "react";
import InputItem from "./items/InputItem";
import DatePickerItem from "./items/DatePickerItem";
import SelectItem from "./items/SelectItem";
import NumberInputItem from "./items/NumberInputItem";
import NumberRangeItem from "./items/NumberRangeItem";
import {
  ModuleRuleConditionMethodEnum,
  type ModuleRuleConditionMethodType,
  type IWidget,
} from "@metaflux/core";

export interface ConditionFieldProps {
  methodType: ModuleRuleConditionMethodType;
  widgetData: IWidget;
  onChange?: (val: string[]) => void;
  value?: string[];
}

const ConditionField: FC<ConditionFieldProps> = ({
  widgetData,
  methodType,
  onChange,
  value,
}) => {
  const renderField = () => {
    switch (methodType) {
      case ModuleRuleConditionMethodEnum.EQ:
      case ModuleRuleConditionMethodEnum.NE:
        if (widgetData?.widgetType === "Date")
          return <DatePickerItem onChange={onChange} value={value} />;
        if (widgetData?.widgetType === "Input")
          return <InputItem onChange={onChange} value={value} />;
        if (widgetData?.widgetType === "NumberInput")
          return <NumberInputItem onChange={onChange} value={value} />;
        return (
          <SelectItem
            options={widgetData?.options}
            onChange={onChange}
            value={value}
          />
        );
      case ModuleRuleConditionMethodEnum.LT:
      case ModuleRuleConditionMethodEnum.GT:
      case ModuleRuleConditionMethodEnum.LTE:
      case ModuleRuleConditionMethodEnum.GTE:
        if (widgetData?.widgetType === "Date")
          return <DatePickerItem onChange={onChange} value={value} />;
        return <NumberInputItem onChange={onChange} value={value} />;
      case ModuleRuleConditionMethodEnum.RANGE:
        if (widgetData?.widgetType === "Date")
          return (
            <DatePickerItem type="range" onChange={onChange} value={value} />
          );
        return <NumberRangeItem onChange={onChange} value={value} />;
      case ModuleRuleConditionMethodEnum.IN:
        return (
          <SelectItem
            value={value}
            options={widgetData?.options}
            mode="multiple"
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
};

export default ConditionField;
