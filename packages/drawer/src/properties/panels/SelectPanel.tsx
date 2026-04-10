import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { IWidget, IWidgetOption } from "@metaflux/core";
import AvailableOptionsModal from "../components/AvailableOptionsModal";
import { DRAWER_I18N_NS } from "../../i18n";
import styles from "../../styles/propertyPanel.less";

interface SelectPanelProps {
  data: IWidget;
  handleUpdateOptions?: (options: IWidgetOption[]) => void;
}

const SelectPanel: FC<SelectPanelProps> = ({ data, handleUpdateOptions }) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

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
      <Form.Item label={t("defaultValue")} name="defaultValue">
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          allowClear
          options={data?.options}
        />
      </Form.Item>
      <Row>
        <Col span={7} />
        <Col>
          <Button size="small" onClick={() => setOptionsModalVisible(true)}>
            {t("editOptions")}
          </Button>
        </Col>
      </Row>
      <AvailableOptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        onConfirm={(opts) => {
          handleUpdateOptions?.(opts);
          setOptionsModalVisible(false);
        }}
        data={data}
      />
    </>
  );
};

export default SelectPanel;
