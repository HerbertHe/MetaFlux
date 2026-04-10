import { useEffect, type FC } from "react";
import { Form } from "antd";
import InputPanel from "./panels/InputPanel";
import RadioPanel from "./panels/RadioPanel";
import CheckboxPanel from "./panels/CheckboxPanel";
import SelectPanel from "./panels/SelectPanel";
import DatePanel from "./panels/DatePanel";
import { useDebounceFn } from "ahooks";
import { useDrawerStore } from "../store";
import type { IWidgetOption, IFuncData, IWidget } from "@metaflux/core";
import styles from "../styles/widgetProperties.less";
import dayjs from "dayjs";

export interface FieldPropertiesProps {
  sectionIndex: number;
  widgetId: string;
}

const FormFieldProperties: FC<FieldPropertiesProps> = ({
  sectionIndex,
  widgetId,
}) => {
  const { getSectionWidget, updateSectionWidget } = useDrawerStore();
  const [fieldPropertiesForm] = Form.useForm();
  const currentWidget = getSectionWidget(sectionIndex, widgetId);

  useEffect(() => {
    const widget = getSectionWidget(sectionIndex, widgetId);
    fieldPropertiesForm.resetFields();
    fieldPropertiesForm.setFieldsValue({
      ...widget,
      defaultValue:
        widget?.widgetType === "Date"
          ? widget.defaultValue
            ? dayjs(widget.defaultValue)
            : undefined
          : widget.defaultValue,
    });
  }, [sectionIndex, widgetId]);

  const handleUpdateOptions = (options: IWidgetOption[]) => {
    fieldPropertiesForm.setFieldsValue({ ...currentWidget, defaultValue: "" });
    updateSectionWidget(sectionIndex, widgetId, {
      ...getSectionWidget(sectionIndex, widgetId),
      options,
      defaultValue: "",
    });
  };

  const handleUpdateFuncList = (funcList: IFuncData[]) => {
    updateSectionWidget(sectionIndex, widgetId, {
      ...getSectionWidget(sectionIndex, widgetId),
      funcList: funcList || [],
    });
  };

  const handleUpdateDefaultValue = (value?: string) => {
    fieldPropertiesForm.setFieldsValue({ ...currentWidget, defaultValue: "" });
    updateSectionWidget(sectionIndex, widgetId, {
      ...getSectionWidget(sectionIndex, widgetId),
      defaultValue: value ?? "",
    });
  };

  const handleUpdateRange = (range: [string, string]) => {
    const widget = getSectionWidget(sectionIndex, widgetId);
    updateSectionWidget(sectionIndex, widgetId, {
      ...widget,
      extendInfo: JSON.stringify(
        widget.extendInfo
          ? { ...JSON.parse(widget.extendInfo), range: range || ["", ""] }
          : { range: range || ["", ""] },
      ),
    });
  };

  const handleUpdateWidget = (changeValues: any) => {
    const widget = getSectionWidget(sectionIndex, widgetId);
    let updateWidget: IWidget;
    if (widget?.widgetType === "Date" && changeValues?.defaultValue) {
      updateWidget = {
        ...widget,
        defaultValue: dayjs(changeValues.defaultValue).format("YYYY-MM-DD"),
      };
    } else {
      updateWidget = { ...widget, ...changeValues };
    }
    updateSectionWidget(sectionIndex, widgetId, updateWidget);
  };

  const { run: handleFormValuesChange } = useDebounceFn(handleUpdateWidget, {
    wait: 300,
  });

  return (
    <div className={styles["field-properties"]}>
      <Form
        form={fieldPropertiesForm}
        labelCol={{ span: 7 }}
        onValuesChange={handleFormValuesChange}
      >
        {(currentWidget?.widgetType === "Input" ||
          currentWidget?.widgetType === "NumberInput") && (
          <InputPanel
            key={currentWidget.widgetId}
            onUpdateDefaultValue={handleUpdateDefaultValue}
            onUpdateFuncList={handleUpdateFuncList}
            data={currentWidget}
          />
        )}
        {(currentWidget?.widgetType === "Radio" ||
          currentWidget?.widgetType === "CustomRadio") && (
          <RadioPanel
            data={currentWidget}
            handleUpdateOptions={handleUpdateOptions}
          />
        )}
        {currentWidget?.widgetType === "Checkbox" && (
          <CheckboxPanel
            data={currentWidget}
            handleUpdateOptions={handleUpdateOptions}
          />
        )}
        {currentWidget?.widgetType === "Select" && (
          <SelectPanel
            data={currentWidget}
            handleUpdateOptions={handleUpdateOptions}
          />
        )}
        {currentWidget?.widgetType === "Date" && (
          <DatePanel
            data={currentWidget}
            handleUpdateRange={handleUpdateRange}
            onUpdateDefaultValue={handleUpdateDefaultValue}
          />
        )}
      </Form>
    </div>
  );
};

export default FormFieldProperties;
