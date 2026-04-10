import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import type { FC } from "react";
import { FunctionOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { IWidget, IFuncData } from "@metaflux/core";
import { FormulaEditor } from "../../formula";
import FuncListModal from "../components/FuncListModal";
import { useDrawerStore } from "../../store";
import { DRAWER_I18N_NS } from "../../i18n";
import styles from "../../styles/propertyPanel.less";

interface InputPanelProps {
  data: IWidget;
  onUpdateDefaultValue: (value: string) => void;
  onUpdateFuncList: (funcList: IFuncData[]) => void;
}

const InputPanel: FC<InputPanelProps> = ({
  data,
  onUpdateFuncList,
  onUpdateDefaultValue,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const { getContextVariables } = useDrawerStore();
  const [funcListModalVisible, setFuncListModalVisible] = useState(false);
  const [defaultValueType, setDefaultValueType] = useState<
    "formula" | "custom"
  >(data?.defaultValue?.startsWith("=") ? "formula" : "custom");
  const [showFormulaEditorModal, setShowFormulaEditorModal] = useState(false);
  const [formula, setFormula] = useState<string>(
    data?.defaultValue?.startsWith("=") ? data.defaultValue : "",
  );

  const handleUpdateFuncList = (funcList: IFuncData[]) => {
    onUpdateFuncList(funcList);
    setFuncListModalVisible(false);
  };

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
      <Form.Item label={t("defaultValue")}>
        <Select
          defaultValue={
            data.defaultValue?.startsWith("=") ? "formula" : "custom"
          }
          options={[
            { label: t("custom"), value: "custom" },
            { label: t("formula"), value: "formula" },
          ]}
          onChange={(v) => {
            setDefaultValueType(v as "custom" | "formula");
            onUpdateDefaultValue("");
          }}
        />
      </Form.Item>
      {defaultValueType === "formula" && (
        <div
          style={{
            width: "100%",
            marginTop: -10,
            marginBottom: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{ width: 228 }}
            type="default"
            icon={<FunctionOutlined />}
            onClick={() => setShowFormulaEditorModal(true)}
          >
            {t("editFormula")}
          </Button>
        </div>
      )}
      {defaultValueType === "custom" && (
        <Form.Item
          name="defaultValue"
          style={{ marginTop: -10, marginBottom: 24 }}
          rules={[
            {
              validator(_, value) {
                if (value?.[0] === "=") {
                  return Promise.reject(t("customDefaultValueNoEqual"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input maxLength={200} placeholder={t("enterDefaultValue")} />
        </Form.Item>
      )}
      <Button type="link" onClick={() => setFuncListModalVisible(true)}>
        {t("editValidationRules")}
      </Button>
      <FuncListModal
        visible={funcListModalVisible}
        onClose={() => setFuncListModalVisible(false)}
        onConfirm={handleUpdateFuncList}
        data={data.funcList}
      />
      <Modal
        open={showFormulaEditorModal}
        title={t("editFormula")}
        width={760}
        closable={false}
        onCancel={() => {
          setShowFormulaEditorModal(false);
          setFormula("");
        }}
        onOk={() => {
          onUpdateDefaultValue(formula);
          setFormula("");
          setShowFormulaEditorModal(false);
          const displayVal = formula.slice(1).length > 0 ? formula : t("formulaValueEmpty");
          message.success(t("formulaValueMsg", { value: displayVal }));
        }}
      >
        <FormulaEditor
          fieldLabel={`${data.label} Default`}
          saveFormula={(v) => setFormula(v)}
          defaultFormula={
            data.defaultValue?.startsWith("=")
              ? data.defaultValue.slice(1)
              : ""
          }
          contextVariables={getContextVariables(data.widgetId)}
        />
      </Modal>
    </>
  );
};

export default InputPanel;
