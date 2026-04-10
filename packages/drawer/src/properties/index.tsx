import { useEffect, useState, type FC } from "react";
import { Button, Popconfirm, Tabs } from "antd";
import { useTranslation } from "react-i18next";

import FormFieldProperties from "./FormFieldProperties";
import FormRules from "../rules";
import styles from "../styles/widgetProperties.less";
import { useDrawerStore } from "../store";
import { DRAWER_I18N_NS } from "../i18n";

export interface WidgetPropertiesPanelProps {
  sectionIndex: number;
  widgetId: string;
  handleResetWidgetId?: () => void;
}

const WidgetPropertiesPanel: FC<WidgetPropertiesPanelProps> = ({
  sectionIndex,
  widgetId,
  handleResetWidgetId,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [activeKey, setActiveKey] = useState("");
  const { removeSectionWidget } = useDrawerStore();

  useEffect(() => {
    setActiveKey(widgetId ? "fieldProperties" : "");
  }, [widgetId]);

  const handleConfirmDelete = () => {
    removeSectionWidget(sectionIndex, widgetId);
    handleResetWidgetId?.();
  };

  return (
    <div className={styles["properties-container"]}>
      <Tabs
        className={styles.tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: "fieldProperties",
            label: t("fieldProperties"),
            children: activeKey === "fieldProperties" ? (
              <FormFieldProperties
                sectionIndex={sectionIndex}
                widgetId={widgetId}
              />
            ) : null,
          },
          {
            key: "formRules",
            label: t("linkageRules"),
            children: activeKey === "formRules" ? <FormRules /> : null,
          },
        ]}
      />
      <div className={styles["widget-delete-item"]}>
        <Popconfirm
          placement="top"
          title={t("deleteWidgetConfirm")}
          onConfirm={handleConfirmDelete}
          okText={t("confirm")}
          cancelText={t("cancel")}
        >
          <Button danger type="primary">
            {t("deleteWidget")}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default WidgetPropertiesPanel;
