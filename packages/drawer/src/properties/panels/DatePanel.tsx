import { Checkbox, DatePicker, Form, Input, Row, Select, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { IWidget } from "@metaflux/core";
import { DRAWER_I18N_NS } from "../../i18n";
import styles from "../../styles/propertyPanel.less";

const { Text } = Typography;

interface DatePanelProps {
  data: IWidget;
  handleUpdateRange: (range: [string, string]) => void;
  onUpdateDefaultValue: (value?: string) => void;
}

type AvailableDateType = "dynamic" | "static";

const DatePanel: FC<DatePanelProps> = ({
  data,
  handleUpdateRange,
  onUpdateDefaultValue,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [minSelectable, setMinSelectable] = useState(false);
  const [maxSelectable, setMaxSelectable] = useState(false);
  const [minDateType, setMinDateType] = useState<AvailableDateType>("dynamic");
  const [maxDateType, setMaxDateType] = useState<AvailableDateType>("dynamic");
  const [initData, setInitData] = useState(true);
  const [minValue, setMinValue] = useState<string>();
  const [maxValue, setMaxValue] = useState<string>();

  const dynamicOptions = useMemo(
    () => [
      { label: t("today"), value: "=$today" },
      { label: t("yesterday"), value: "=$yesterday" },
      { label: t("tomorrow"), value: "=$tomorrow" },
      { label: t("daysAgo7"), value: "=$today-7D" },
      { label: t("daysLater7"), value: "=$today+7D" },
      { label: t("daysAgo30"), value: "=$today-30D" },
      { label: t("daysLater30"), value: "=$today+30D" },
    ],
    [t],
  );

  useEffect(() => {
    if (data?.extendInfo && JSON.parse(data.extendInfo)?.range) {
      const { range } = JSON.parse(data.extendInfo);
      if (range?.[0]) {
        const min = range[0] as string;
        setMinSelectable(true);
        setMinValue(min);
        setMinDateType(min.startsWith("=") ? "dynamic" : "static");
      } else {
        setMinSelectable(false);
        setMinValue("");
        setMinDateType("dynamic");
      }
      if (range?.[1]) {
        const max = range[1] as string;
        setMaxSelectable(true);
        setMaxValue(max);
        setMaxDateType(max.startsWith("=") ? "dynamic" : "static");
      } else {
        setMaxSelectable(false);
        setMaxValue("");
        setMaxDateType("dynamic");
      }
      setInitData(false);
      return;
    }
    setMinSelectable(false);
    setMaxSelectable(false);
    setMinValue("");
    setMaxValue("");
    setMinDateType("dynamic");
    setMaxDateType("dynamic");
    setInitData(false);
  }, []);

  useEffect(() => {
    if (minValue) {
      if (minDateType === "dynamic" && !minValue.startsWith("="))
        setMinValue("=$today");
      if (minDateType === "static" && minValue.startsWith("="))
        setMinValue(dayjs().format("YYYY-MM-DD"));
    }
  }, [minDateType]);

  useEffect(() => {
    if (maxValue) {
      if (maxDateType === "dynamic" && !maxValue.startsWith("="))
        setMaxValue("=$today");
      if (maxDateType === "static" && maxValue.startsWith("="))
        setMaxValue(dayjs().format("YYYY-MM-DD"));
    }
  }, [maxDateType]);

  useEffect(() => {
    if (!initData) {
      if (minSelectable && !minValue) setMinValue("=$today");
      if (!minSelectable) setMinValue("");
    }
  }, [minSelectable]);

  useEffect(() => {
    if (!initData) {
      if (maxSelectable && !maxValue) setMaxValue("=$today");
      if (!maxSelectable) setMaxValue("");
    }
  }, [maxSelectable]);

  useEffect(() => {
    if (!initData && minValue !== undefined && maxValue !== undefined) {
      handleUpdateRange([minValue, maxValue]);
    }
  }, [minValue, maxValue]);

  return (
    <>
      <Form.Item
        label={t("label")}
        required
        name="label"
        rules={[{ required: true, message: t("labelRequired") }]}
      >
        <Input className={styles["form-item"]} maxLength={20} />
      </Form.Item>
      <Form.Item
        label={t("fieldKey")}
        required
        name="fieldKey"
        rules={[
          { required: true, max: 45 },
          {
            validator: (_, value) =>
              /^[A-Z]+$/.test(value)
                ? Promise.resolve()
                : Promise.reject(t("fieldKeyUppercase")),
          },
        ]}
      >
        <Input className={styles["form-item"]} maxLength={20} />
      </Form.Item>
      <Form.Item label={t("description")} name="description">
        <Input className={styles["form-item"]} maxLength={100} />
      </Form.Item>
      <Form.Item
        label={t("placeholder")}
        name="placeholder"
        rules={[{ required: true, message: t("placeholderRequired") }]}
      >
        <Input className={styles["form-item"]} maxLength={100} />
      </Form.Item>
      <div className={styles["time-default-value"]}>
        {t("default")}
        <DatePicker
          getPopupContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
          allowClear
          value={data?.defaultValue ? dayjs(data.defaultValue) : undefined}
          onChange={(date) =>
            onUpdateDefaultValue(date ? dayjs(date).format("YYYY-MM-DD") : "")
          }
        />
      </div>
      <div className={styles["time-range"]}>
        <Text strong className={styles.margin}>
          {t("selectableRange")}
        </Text>
        <div className={styles["time-range-container"]}>
          <Checkbox
            className={styles.margin}
            checked={minSelectable}
            onChange={() => setMinSelectable(!minSelectable)}
          >
            {t("earliestSelectable")}
          </Checkbox>
          {minSelectable && (
            <Row className={styles.margin}>
              <Select
                value={minDateType}
                options={[
                  { label: t("dynamic"), value: "dynamic" },
                  { label: t("static"), value: "static" },
                ]}
                onChange={(v) => setMinDateType(v as AvailableDateType)}
              />
              {minDateType === "dynamic" && (
                <Select
                  value={minValue}
                  className={styles["time-range-field"]}
                  options={dynamicOptions}
                  onChange={setMinValue}
                />
              )}
              {minDateType === "static" && (
                <DatePicker
                  value={minValue ? dayjs(minValue) : undefined}
                  className={styles["time-range-field"]}
                  onChange={(v) => v && setMinValue(dayjs(v).format("YYYY-MM-DD"))}
                />
              )}
            </Row>
          )}
        </div>
        <div className={styles["time-range-container"]}>
          <Checkbox
            checked={maxSelectable}
            onChange={() => setMaxSelectable(!maxSelectable)}
            className={styles.margin}
          >
            {t("latestSelectable")}
          </Checkbox>
          {maxSelectable && (
            <Row className={styles.margin}>
              <Select
                value={maxDateType}
                options={[
                  { label: t("dynamic"), value: "dynamic" },
                  { label: t("static"), value: "static" },
                ]}
                onChange={(v) => setMaxDateType(v as AvailableDateType)}
              />
              {maxDateType === "dynamic" && (
                <Select
                  className={styles["time-range-field"]}
                  value={maxValue}
                  options={dynamicOptions}
                  onChange={setMaxValue}
                />
              )}
              {maxDateType === "static" && (
                <DatePicker
                  className={styles["time-range-field"]}
                  value={maxValue ? dayjs(maxValue) : undefined}
                  onChange={(v) => v && setMaxValue(dayjs(v).format("YYYY-MM-DD"))}
                />
              )}
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default DatePanel;
