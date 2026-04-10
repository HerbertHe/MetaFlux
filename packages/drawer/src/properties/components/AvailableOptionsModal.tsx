import { Button, Form, Input, message, Modal, Space, Table, Popconfirm } from "antd";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { IWidget, IWidgetOption } from "@metaflux/core";
import { useDrawerStore } from "../../store";
import { DRAWER_I18N_NS } from "../../i18n";

interface AvailableOptionsModalProps {
  visible: boolean;
  data: IWidget;
  onClose?: () => void;
  onConfirm?: (options: IWidgetOption[]) => void;
}

const AvailableOptionsModal: FC<AvailableOptionsModalProps> = ({
  visible,
  data,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const { getRules } = useDrawerStore();
  const [options, setOptions] = useState<IWidgetOption[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      setOptions(data?.options ? [...data.options] : []);
      setEditingKey("");
    }
  }, [visible]);

  const isEditing = (record: IWidgetOption) => record.id === editingKey;

  const handleEdit = (record: IWidgetOption) => {
    form.setFieldsValue({ label: record.label, value: record.value });
    setEditingKey(record.id || "");
  };

  const handleSave = async (id: string) => {
    const row = await form.validateFields();
    const idx = options.findIndex((o) => o.id === id);
    if (idx >= 0) {
      const newOptions = [...options];
      newOptions[idx] = { ...newOptions[idx], ...row };
      setOptions(newOptions);
    }
    setEditingKey("");
  };

  const handleDelete = (record: IWidgetOption) => {
    const rules = getRules();
    const allRuleItems = rules.flatMap((r) => [...r.conditions, ...r.results]);
    const isUsedInRules = allRuleItems.some(
      (item) =>
        item.widgetId === data.widgetId &&
        item.values?.includes(record.value),
    );
    if (isUsedInRules) {
      message.error(t("optionUsedInRules"));
    } else {
      setOptions(options.filter((o) => o.id !== record.id));
    }
  };

  const handleAdd = () => {
    const newOption: IWidgetOption = {
      id: nanoid(),
      label: "",
      value: "",
    };
    setOptions([...options, newOption]);
    handleEdit(newOption);
  };

  const columns = [
    {
      title: t("labelColumn"),
      dataIndex: "label",
      render: (_: any, record: IWidgetOption) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="label"
              style={{ margin: 0 }}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.label;
      },
    },
    {
      title: t("valueColumn"),
      dataIndex: "value",
      render: (_: any, record: IWidgetOption) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="value"
              style={{ margin: 0 }}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          );
        }
        return record.value;
      },
    },
    {
      title: t("actionsColumn"),
      render: (_: any, record: IWidgetOption) => {
        if (isEditing(record)) {
          return (
            <Space>
              <a onClick={() => handleSave(record.id!)}>{t("save")}</a>
              <a onClick={() => setEditingKey("")}>{t("cancel")}</a>
            </Space>
          );
        }
        return (
          <Space>
            <a onClick={() => handleEdit(record)}>{t("edit")}</a>
            <Popconfirm
              title={t("deleteOptionConfirm")}
              onConfirm={() => handleDelete(record)}
            >
              <a>{t("delete")}</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      open={visible}
      title={t("widgetOptions")}
      width={650}
      maskClosable={false}
      onOk={() => {
        if (editingKey) {
          message.error(t("saveEditsFirst"));
        } else if (
          JSON.stringify(data?.options) === JSON.stringify(options)
        ) {
          onClose?.();
        } else {
          onConfirm?.(options);
        }
      }}
      destroyOnClose
      onCancel={onClose}
    >
      <Form form={form} component={false}>
        <Button
          type="primary"
          size="small"
          onClick={handleAdd}
          style={{ marginBottom: 8 }}
        >
          {t("addOption")}
        </Button>
        <Table
          rowKey="id"
          dataSource={options}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Form>
    </Modal>
  );
};

export default AvailableOptionsModal;
