import { useState } from "react";
import type { FC } from "react";
import { Button, Drawer, Popconfirm, Tooltip } from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LinkageRulesModal from "./components/LinkageRulesModal";
import { useDrawerStore } from "../store";
import {
  type IModuleRule,
  ModuleRuleRelationEnum,
  ModuleRuleResultMethodEnum,
  ConditionMethodDisplayMap,
  ModuleRuleConditionMethodEnum,
} from "@metaflux/core";
import { DRAWER_I18N_NS } from "../i18n";
import styles from "../styles/formRules.less";

const FormRules: FC = () => {
  const { t } = useTranslation(DRAWER_I18N_NS);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ruleData, setRuleData] = useState<IModuleRule>();
  const [ruleIndex, setRuleIndex] = useState(-1);
  const { getRules, updateRules, getSectionWidget, sections } =
    useDrawerStore();

  const handleAddRule = () => {
    setRuleData({
      conditions: [{ sectionIndex: 0, widgetId: "", method: undefined, values: [] }],
      results: [{ sectionIndex: 0, widgetId: "", method: undefined, values: [] }],
      description: "",
      relation: ModuleRuleRelationEnum.AND,
    });
    setRuleIndex(-1);
    setModalVisible(true);
  };

  const handleUpdateRule = (rule: IModuleRule) => {
    let rules = getRules();
    if (ruleIndex >= 0) {
      rules[ruleIndex] = rule;
    } else {
      rules = [...rules, rule];
    }
    updateRules(rules);
    setModalVisible(false);
  };

  const handleEditRule = (rule: IModuleRule, index: number) => {
    setRuleData(index >= 0 ? rule : { ...rule, description: "" });
    setRuleIndex(index);
    setModalVisible(true);
  };

  const handleDeleteRule = (index: number) => {
    const rules = getRules();
    rules.splice(index, 1);
    updateRules(rules);
  };

  return (
    <div className={styles["form-properties"]}>
      <Button
        type="primary"
        className={styles["form-linkage-rules-btn"]}
        onClick={() => setDrawerVisible(true)}
      >
        {t("linkageRules")}
      </Button>
      <span>{t("rulesConfigured", { count: getRules()?.length ?? 0 })}</span>
      <Drawer
        title={t("linkageRules")}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
        open={drawerVisible}
        width="900"
      >
        <div className={styles["linkage-rules-save-btn"]}>
          <Button type="primary" onClick={handleAddRule}>
            {t("addRule")}
          </Button>
        </div>
        <div className={styles["rule-list"]}>
          {getRules()?.map((item, index) => (
            <div className={styles["rule-item-container"]} key={index}>
              <div className={styles["rule-description"]}>
                {t("rulePrefix")}{item.description}
              </div>
              <div className={styles["rule-item"]}>
                <div className={styles["rule-item-l"]}>
                  {item.conditions?.map((condItem, idx) => {
                    const widget = getSectionWidget(
                      condItem.sectionIndex,
                      condItem.widgetId,
                    );
                    const condValue =
                      widget.widgetType === "Input" ||
                      widget.widgetType === "Date" ||
                      widget.widgetType === "NumberInput"
                        ? condItem.values?.join(", ")
                        : condItem.values
                            ?.map((v) => widget.options?.find((o) => o.value === v)?.label ?? v)
                            .join(", ");
                    return (
                      <div className={styles["cond-wrapper"]} key={idx}>
                        <div className={styles["cond-title"]}>
                          {idx === 0
                            ? t("when")
                            : item.relation === ModuleRuleRelationEnum.AND
                              ? t("and")
                              : t("or")}
                        </div>
                        <div className={styles["cond-desc"]}>
                          <span className={styles["cond-desc-black"]}>
                            [{sections[condItem.sectionIndex]}]
                          </span>{" "}
                          <span className={styles["cond-desc-black"]}>
                            [{widget.label}]
                          </span>{" "}
                          {condItem.method && ConditionMethodDisplayMap[condItem.method as ModuleRuleConditionMethodEnum]}
                          {" "}
                          <span className={styles["cond-desc-black"]}>
                            [{condValue}]
                          </span>
                          {condItem.method === ModuleRuleConditionMethodEnum.RANGE && ` ${t("between")}`}
                          {condItem.method === ModuleRuleConditionMethodEnum.IN && ` ${t("anyOf")}`}
                        </div>
                      </div>
                    );
                  })}
                  {item.results?.map((resItem, idx) => {
                    const widget = getSectionWidget(
                      resItem.sectionIndex,
                      resItem.widgetId,
                    );
                    const resValue =
                      widget.widgetType === "Input" ||
                      widget.widgetType === "Date" ||
                      widget.widgetType === "NumberInput"
                        ? resItem.values?.join(", ")
                        : resItem.values
                            ?.map((v) => widget.options?.find((o) => o.value === v)?.label ?? v)
                            .join(", ");
                    return (
                      <div className={styles["cond-wrapper"]} key={idx}>
                        <div className={styles["cond-resule-title"]}>
                          {resItem.method === ModuleRuleResultMethodEnum.Hide
                            ? t("hide")
                            : t("set")}
                        </div>
                        <div className={styles["cond-desc"]}>
                          <span className={styles["cond-desc-black"]}>
                            [{sections[resItem.sectionIndex]}]
                          </span>{" "}
                          <span className={styles["cond-desc-black"]}>
                            [{widget.label}]
                          </span>
                          {resItem.method === ModuleRuleResultMethodEnum.ReadOnly && (
                            <span className={`${styles["cond-desc-black"]} ${styles["val-spacing"]}`}>
                              {t("toReadOnly")}
                            </span>
                          )}
                          {resItem.method === ModuleRuleResultMethodEnum.Writeable && (
                            <span className={`${styles["cond-desc-black"]} ${styles["val-spacing"]}`}>
                              {t("toWritable")}
                            </span>
                          )}
                          {resItem.method === ModuleRuleResultMethodEnum.SetValue && (
                            <>
                              {" "}{t("valueTo")}{" "}
                              <span className={`${styles["cond-desc-black"]} ${styles["val-spacing"]}`}>
                                {resValue}
                              </span>
                            </>
                          )}
                          {resItem.method === ModuleRuleResultMethodEnum.SetOptions && (
                            <>
                              {" "}{t("optionsTo")}{" "}
                              <span className={`${styles["cond-desc-black"]} ${styles["val-spacing"]}`}>
                                {resValue}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles["rule-item-r"]}>
                  <Tooltip title={t("copyAsNewRule")}>
                    <CopyOutlined
                      className={styles["handle-icon"]}
                      onClick={() => handleEditRule(item, -1)}
                    />
                  </Tooltip>
                  <EditOutlined
                    className={styles["handle-icon"]}
                    onClick={() => handleEditRule(item, index)}
                  />
                  <Popconfirm
                    placement="left"
                    title={t("deleteRuleConfirm")}
                    onConfirm={() => handleDeleteRule(index)}
                  >
                    <DeleteOutlined className={styles["handle-icon"]} />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
      <LinkageRulesModal
        visible={modalVisible}
        ruleData={ruleData}
        onClose={() => setModalVisible(false)}
        onConfirm={handleUpdateRule}
      />
    </div>
  );
};

export default FormRules;
