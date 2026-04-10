import { Button, Form, Input, Modal, Space } from "antd";
import { useEffect } from "react";
import type { FC } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { IFuncData } from "@metaflux/core";
import { DRAWER_I18N_NS } from "../../i18n";
import styles from "../../styles/funcListModal.less";

interface FuncListModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (funcList: IFuncData[]) => void;
  data?: IFuncData[];
}

const FuncListModal: FC<FuncListModalProps> = ({
  visible,
  onClose,
  onConfirm,
  data,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ funcList: data });
    }
  }, [visible]);

  function handleClose() {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      open={visible}
      closable={false}
      footer={
        <Space>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button
            type="primary"
            onClick={async () => {
              await form.validateFields();
              const funcList = form
                .getFieldValue("funcList")
                ?.map((item: IFuncData) => ({
                  func: item.func,
                  message: item.message,
                }));
              onConfirm(funcList);
            }}
          >
            {t("save")}
          </Button>
        </Space>
      }
      title={t("editValidationRules")}
      width={600}
      onCancel={handleClose}
      afterClose={() => form.resetFields()}
    >
      <Form form={form}>
        <Form.List name="funcList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name: fieldName }) => (
                <div key={key}>
                  <Form.Item
                    name={[fieldName, "func"]}
                    label={t("rule")}
                    rules={[
                      { required: true, message: t("pleaseEnterRule") },
                    ]}
                  >
                    <Input
                      placeholder={t("enterValidationRule")}
                      allowClear
                      maxLength={1000}
                      className={styles["func-item"]}
                      addonAfter={
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => remove(fieldName)}
                        />
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name={[fieldName, "message"]}
                    rules={[
                      { required: true, message: t("pleaseEnterMessage") },
                    ]}
                    label={t("message")}
                  >
                    <Input
                      placeholder={t("validationMessage")}
                      allowClear
                      maxLength={1000}
                    />
                  </Form.Item>
                </div>
              ))}
              <Button type="primary" onClick={() => add()}>
                {t("addValidationRule")}
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default FuncListModal;
