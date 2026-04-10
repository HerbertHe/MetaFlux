import type { FC } from "react";
import {
  ModuleRuleResultMethodEnum,
  type ModuleRuleResultMethodType,
  type IWidget,
} from "@metaflux/core";
import InputItem from "./items/InputItem";
import DatePickerItem from "./items/DatePickerItem";
import SelectItem from "./items/SelectItem";
import NumberInputItem from "./items/NumberInputItem";

export interface ResultFieldProps {
  methodType: ModuleRuleResultMethodType;
  widgetData: IWidget;
  onChange?: (val: string[]) => void;
  value?: string[];
}

const ResultField: FC<ResultFieldProps> = ({
  methodType,
  widgetData,
  onChange,
  value,
}) => {
  const renderField = () => {
    switch (widgetData?.widgetType) {
      case "Input":
        return <InputItem onChange={onChange} value={value} />;
      case "NumberInput":
        return <NumberInputItem onChange={onChange} value={value} />;
      case "Date":
        return <DatePickerItem onChange={onChange} value={value} />;
      default:
        return (
          <SelectItem
            options={widgetData?.options}
            onChange={onChange}
            value={value}
            mode={
              methodType === ModuleRuleResultMethodEnum.SetOptions
                ? "multiple"
                : undefined
            }
          />
        );
    }
  };

  return <>{renderField()}</>;
};

export default ResultField;
