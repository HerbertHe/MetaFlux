import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Popconfirm, Row, Select } from "antd";
import { useEffect } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  type IModuleRule,
  ModuleRuleRelationEnum,
  ModuleRuleResultMethodEnum,
  getConditionMethodsForWidget,
  getResultMethodsForWidget,
} from "@metaflux/core";
import { useDrawerStore } from "../../store";
import ConditionField from "./ConditionField";
import ResultField from "./ResultField";
import { DRAWER_I18N_NS } from "../../i18n";
import styles from "../../styles/formRules.less";

interface LinkageRulesModalProps {
  visible: boolean;
  ruleData?: IModuleRule;
  onClose?: () => void;
  onConfirm?: (rule: IModuleRule) => void;
}

const { List: FormList, useForm } = Form;

const LinkageRulesModal: FC<LinkageRulesModalProps> = ({
  visible,
  onClose,
  ruleData,
  onConfirm,
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [form] = useForm();
  const { getWidgets, getSectionWidget, sections } = useDrawerStore();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(ruleData);
    }
  }, [visible]);

  function checkWidgetIdConflict(values: IModuleRule) {
    const conditionIds = values.conditions.map((item) => item.widgetId);
    const resultIds = values.results.map((item) => item.widgetId);
    return !resultIds.some((id) => conditionIds.includes(id));
  }

  const sectionOptions = sections.map((s, idx) => ({
    label: s,
    value: idx,
  }));

  return (
    <Modal
      open={visible}
      title={t("linkageRules")}
      zIndex={9999}
      width={1000}
      maskClosable={false}
      onOk={async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        if (!checkWidgetIdConflict(values)) {
          message.error(t("conflictMsg"));
        } else {
          onConfirm?.(values);
        }
      }}
      destroyOnClose
      onCancel={onClose}
    >
      <div>
        <Form form={form} scrollToFirstError>
          <Form.Item
            label={t("description")}
            required
            name="description"
            rules={[{ required: true, message: t("pleaseEnterDescription") }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <div className={styles["linkage-rule-rel"]}>
            <span className={styles["linkage-rule-rel-txt"]}>{t("match")}</span>
            <Form.Item
              className={styles["linkage-rule-rel-select"]}
              required
              name="relation"
              rules={[{ required: true, message: t("required") }]}
            >
              <Select
                getPopupContainer={(node) => node.parentNode as HTMLElement}
                className={styles["conditional-ogic"]}
                variant="borderless"
                options={[
                  { value: ModuleRuleRelationEnum.AND, label: t("all") },
                  { value: ModuleRuleRelationEnum.OR, label: t("any") },
                ]}
              />
            </Form.Item>
            <span className={styles["linkage-rule-rel-txt"]}>{t("conditions")}</span>
          </div>

          {/* Conditions */}
          <div>
            <FormList name="conditions">
              {(fields, { add, remove }) => (
                <>
                  <Row>
                    <Button
                      className={styles["condition-add-btn"]}
                      type="link"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      {t("addCondition")}
                    </Button>
                  </Row>
                  {fields.map(({ key, name }) => (
                    <div key={key}>
                      <Row gutter={24} style={{ marginLeft: 0 }}>
                        <div className={styles["rule-block"]}>
                          <Form.Item
                            name={[name, "sectionIndex"]}
                            required
                            rules={[{ required: true, message: t("selectSection") }]}
                          >
                            <Select
                              placeholder={t("sectionPlaceholder")}
                              className={styles["conditional-range"]}
                              getPopupContainer={(node) => node.parentNode as HTMLElement}
                              options={sectionOptions}
                              onChange={() => {
                                const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                                values.conditions[name] = {
                                  ...values.conditions[name],
                                  widgetId: undefined,
                                  method: undefined,
                                  values: undefined,
                                };
                                form.setFieldsValue(values);
                              }}
                            />
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const sectionIndex = getFieldValue(["conditions", name, "sectionIndex"]);
                              const widgetOptions = getWidgets()?.[sectionIndex]?.map((item) => ({
                                label: item.label,
                                value: item.widgetId,
                              }));
                              return sectionIndex !== undefined ? (
                                <>
                                  <span className={styles["filler-txt-left"]}>{t("possessive")}</span>
                                  <Form.Item
                                    name={[name, "widgetId"]}
                                    required
                                    rules={[{ required: true, message: t("selectWidget") }]}
                                  >
                                    <Select
                                      placeholder={t("widgetPlaceholder")}
                                      className={styles["conditional-filter"]}
                                      getPopupContainer={(node) => node.parentNode as HTMLElement}
                                      options={widgetOptions}
                                      onChange={() => {
                                        const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                                        values.conditions[name] = {
                                          ...values.conditions[name],
                                          method: undefined,
                                          values: undefined,
                                        };
                                        form.setFieldsValue(values);
                                      }}
                                    />
                                  </Form.Item>
                                </>
                              ) : null;
                            }}
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const sectionIndex = getFieldValue(["conditions", name, "sectionIndex"]);
                              const widgetId = getFieldValue(["conditions", name, "widgetId"]);
                              const widgetData = getSectionWidget(sectionIndex, widgetId);
                              const methodOptions = widgetData?.widgetType
                                ? getConditionMethodsForWidget(widgetData.widgetType)
                                : [];
                              return widgetId ? (
                                <Form.Item
                                  name={[name, "method"]}
                                  required
                                  rules={[{ required: true, message: t("selectMethod") }]}
                                >
                                  <Select
                                    placeholder={t("methodPlaceholder")}
                                    className={styles["conditional-filter"]}
                                    getPopupContainer={(node) => node.parentNode as HTMLElement}
                                    options={methodOptions}
                                    onChange={() => {
                                      const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                                      values.conditions[name] = {
                                        ...values.conditions[name],
                                        values: undefined,
                                      };
                                      form.setFieldsValue(values);
                                    }}
                                  />
                                </Form.Item>
                              ) : null;
                            }}
                          </Form.Item>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const sectionIndex = getFieldValue(["conditions", name, "sectionIndex"]);
                              const widgetId = getFieldValue(["conditions", name, "widgetId"]);
                              const method = getFieldValue(["conditions", name, "method"]);
                              const widgetData = getSectionWidget(sectionIndex, widgetId);
                              if (!method) return null;
                              return (
                                <>
                                  <Form.Item
                                    name={[name, "values"]}
                                    required
                                    rules={[{ required: true, message: t("setValue") }]}
                                  >
                                    <ConditionField
                                      methodType={method}
                                      widgetData={widgetData}
                                    />
                                  </Form.Item>
                                  <span className={styles["filler-txt-right"]}>{t("then")}</span>
                                </>
                              );
                            }}
                          </Form.Item>
                        </div>
                        {name > 0 && (
                          <Popconfirm
                            title={t("deleteConditionConfirm")}
                            onConfirm={() => remove(name)}
                          >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                              {t("delete")}
                            </Button>
                          </Popconfirm>
                        )}
                      </Row>
                    </div>
                  ))}
                </>
              )}
            </FormList>
          </div>

          {/* Results */}
          <div>
            <FormList name="results">
              {(fields, { add, remove }) => (
                <>
                  <Row>
                    <Button
                      className={styles["condition-add-btn"]}
                      type="link"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      {t("addResult")}
                    </Button>
                  </Row>
                  {fields.map(({ key, name }) => (
                    <div key={key}>
                      <Row gutter={24} style={{ marginLeft: 0 }}>
                        <Form.Item
                          name={[name, "sectionIndex"]}
                          required
                          rules={[{ required: true, message: t("selectSection") }]}
                        >
                          <Select
                            placeholder={t("sectionPlaceholder")}
                            className={styles["conditional-range"]}
                            getPopupContainer={(node) => node.parentNode as HTMLElement}
                            options={sectionOptions}
                            onChange={() => {
                              const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                              values.results[name] = {
                                ...values.results[name],
                                widgetId: undefined,
                                method: undefined,
                                values: undefined,
                              };
                              form.setFieldsValue(values);
                            }}
                          />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const sectionIndex = getFieldValue(["results", name, "sectionIndex"]);
                            const widgetOptions = getWidgets()?.[sectionIndex]?.map((item) => ({
                              label: item.label,
                              value: item.widgetId,
                            }));
                            return sectionIndex !== undefined ? (
                              <>
                                <span className={styles["filler-txt-left"]}>{t("possessive")}</span>
                                <Form.Item
                                  name={[name, "widgetId"]}
                                  required
                                  rules={[{ required: true, message: t("selectWidget") }]}
                                >
                                  <Select
                                    placeholder={t("widgetPlaceholder")}
                                    className={styles["conditional-filter"]}
                                    getPopupContainer={(node) => node.parentNode as HTMLElement}
                                    options={widgetOptions}
                                    onChange={() => {
                                      const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                                      values.results[name] = {
                                        ...values.results[name],
                                        method: undefined,
                                        values: undefined,
                                      };
                                      form.setFieldsValue(values);
                                    }}
                                  />
                                </Form.Item>
                              </>
                            ) : null;
                          }}
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const sectionIndex = getFieldValue(["results", name, "sectionIndex"]);
                            const widgetId = getFieldValue(["results", name, "widgetId"]);
                            const widgetData = getSectionWidget(sectionIndex, widgetId);
                            const methodOptions = widgetData?.widgetType
                              ? getResultMethodsForWidget(widgetData.widgetType)
                              : [];
                            return widgetId ? (
                              <Form.Item
                                name={[name, "method"]}
                                required
                                rules={[{ required: true, message: t("selectMethod") }]}
                              >
                                <Select
                                  placeholder={t("methodPlaceholder")}
                                  className={styles["conditional-filter"]}
                                  getPopupContainer={(node) => node.parentNode as HTMLElement}
                                  options={methodOptions}
                                  onChange={() => {
                                    const values = JSON.parse(JSON.stringify(form.getFieldsValue()));
                                    values.results[name] = {
                                      ...values.results[name],
                                      values: undefined,
                                    };
                                    form.setFieldsValue(values);
                                  }}
                                />
                              </Form.Item>
                            ) : null;
                          }}
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const method = getFieldValue(["results", name, "method"]);
                            const sectionIndex = getFieldValue(["results", name, "sectionIndex"]);
                            const widgetId = getFieldValue(["results", name, "widgetId"]);
                            const widgetData = getSectionWidget(sectionIndex, widgetId);
                            if (
                              (method === ModuleRuleResultMethodEnum.SetValue ||
                                method === ModuleRuleResultMethodEnum.SetOptions) &&
                              widgetId
                            ) {
                              return (
                                <Form.Item
                                  name={[name, "values"]}
                                  required
                                  rules={[{ required: true, message: t("setValue") }]}
                                >
                                  <ResultField
                                    methodType={method}
                                    widgetData={widgetData}
                                  />
                                </Form.Item>
                              );
                            }
                            return null;
                          }}
                        </Form.Item>
                        {name > 0 && (
                          <Popconfirm
                            title={t("deleteResultConfirm")}
                            onConfirm={() => remove(name)}
                          >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                              {t("delete")}
                            </Button>
                          </Popconfirm>
                        )}
                      </Row>
                    </div>
                  ))}
                </>
              )}
            </FormList>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default LinkageRulesModal;
