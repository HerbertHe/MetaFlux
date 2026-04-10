import { useState, type FC } from "react";
import type { IWidget } from "@metaflux/core";
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { useTranslation } from "react-i18next";
import { DRAWER_I18N_NS } from "../i18n";

interface RenderExampleWidgetProps {
  item: IWidget;
}

const RenderExampleWidget: FC<RenderExampleWidgetProps> = ({ item }) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [isOther, setIsOther] = useState(false);

  return (
    <>
      {(item.widgetType === "Input" || item.widgetType === "NumberInput") && (
        <Input readOnly />
      )}
      {item.widgetType === "Radio" && (
        <Radio.Group>
          {item.options?.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
        </Radio.Group>
      )}
      {item.widgetType === "Checkbox" && (
        <Checkbox.Group options={item.options} />
      )}
      {item.widgetType === "Select" && <Select options={item.options} />}
      {item.widgetType === "Date" && <DatePicker picker="date" />}
      {item.widgetType === "CustomRadio" && (
        <>
          <Radio.Group
            onChange={(e) => setIsOther(e.target.value === "other")}
          >
            {item.options?.map((o) => (
              <Radio key={o.value} value={o.value}>
                {o.label}
              </Radio>
            ))}
            <Radio value="other">{t("other")}</Radio>
          </Radio.Group>
          {isOther && (
            <Input
              style={{ marginTop: 5 }}
              placeholder={t("enterOtherValue")}
              readOnly
            />
          )}
        </>
      )}
    </>
  );
};

export default RenderExampleWidget;
