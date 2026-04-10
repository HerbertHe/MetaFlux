import React, { useMemo, useRef, useState } from "react";
import type { FC } from "react";
import { Button, Collapse, List, Tooltip, message } from "antd";
import { ClearOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useDebounceFn } from "ahooks";
import { useTranslation } from "react-i18next";

import CodeMirror, {
  EditorSelection,
  EditorView,
  type Extension,
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import type { Completion } from "@codemirror/autocomplete";
import {
  type ISyntaxError,
  formulaSyntaxLinter,
  validateFormulaSyntaxTree,
} from "unist-formula-ast";
import { micromark } from "micromark";

import styles from "../styles/editor.less";
import {
  funcs,
  SUPPORTED_FUNCTIONS,
  validateContextVariables,
  validateSupportedFunctions,
  type IContextSectionVariables,
  WidgetDisplayNames,
  type SupportedWidgetType,
} from "@metaflux/core";

import { mentions } from "./extensions";
import { contextVariablesLinter, supportedFunctionsLinter } from "./linters";
import { EditorViewDecorationExtension } from "./extensions/widget";
import { DRAWER_I18N_NS } from "../i18n";

const functions = funcs;

interface EditorProps {
  fieldLabel: string;
  defaultFormula?: string;
  saveFormula?: (formulaValue: string) => void;
  contextVariables?: IContextSectionVariables[];
  externalExtensions?: Extension[];
}

const FormulaEditor: FC<EditorProps> = ({
  defaultFormula = "",
  fieldLabel,
  saveFormula,
  contextVariables = [],
  externalExtensions = [],
}) => {
  const { t } = useTranslation(DRAWER_I18N_NS);

  const defaultDescription = [
    t("editorDescLine1"),
    t("editorDescLine2"),
  ].join("\n");

  const [formula, setFormula] = useState<string>(defaultFormula);
  const [hoveredFunction, setHoveredFunction] = useState<string>(t("usageGuide"));
  const [description, setDescription] = useState<string>(defaultDescription);
  const [error, setError] = useState<string>("");
  const codemirrorRef = useRef<ReactCodeMirrorRef>(null);

  const insertTextToCodemirror = (content: string) => {
    const view = codemirrorRef.current?.view;
    if (view) {
      let to = 0;
      view.dispatch(
        view.state.changeByRange((range) => {
          if (content.split("").pop() === ")") {
            to = range.to + content.length - 1;
          } else {
            to = range.to + content.length;
          }
          return {
            changes: { from: range.from, insert: content },
            range: EditorSelection.range(
              range.from,
              range.to + content.length,
            ),
          };
        }),
      );
      view.dispatch({ selection: { anchor: to, head: to } });
    }
  };

  const handleEditorChange = useDebounceFn(
    (value: string) => {
      setFormula(value);
      if (value.length === 0) {
        saveFormula?.("");
        return;
      }

      const v = value.replace(/\s/g, "");
      const e: ISyntaxError[] = [
        validateFormulaSyntaxTree(v),
        ...validateContextVariables(v, contextVariables),
        ...validateSupportedFunctions(v, SUPPORTED_FUNCTIONS),
      ].filter(Boolean);

      if (e.length > 0) {
        setError(
          e.map(({ name, message: msg }) => `${name}: ${msg}`).join("<br />"),
        );
      } else {
        setError("");
        saveFormula?.(`=${v}`);
      }
    },
    { wait: 200 },
  );

  const handleClearAll = () => {
    const view = codemirrorRef.current?.view;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: formula.length, insert: "" },
      });
      message.success(t("formulaEditorCleared"));
    }
  };

  const mentionVariables = useMemo(() => {
    const variables: Completion[] = [];
    contextVariables.forEach((v) => {
      v.variables.forEach((vv) => {
        variables.push({
          label: `$${vv.variable}`,
          displayLabel: `${v.section}-${vv.label}`,
          type: "constant",
        });
      });
    });
    return variables;
  }, [contextVariables]);

  const mentionFunctions = useMemo(() => {
    return funcs
      .map((f) => f.funcs)
      .flat()
      .map(({ name, func }) => ({
        label: func,
        detail: name,
        type: "function",
      })) as Completion[];
  }, []);

  const spreadsheetLang = useMemo(() => {
    return (langs as any).spreadsheet?.() as Extension | undefined;
  }, []);

  return (
    <div className={styles["formula-editor-container"]}>
      <div className={styles.editor}>
        <div className={styles["editor-toolbar"]}>
          <div>{fieldLabel} =</div>
          <div className={styles["toolbar-action"]}>
            <Button
              icon={<ClearOutlined />}
              title={t("clearEditor")}
              type="text"
              size="small"
              style={{ margin: "0 10px" }}
              onClick={handleClearAll}
            />
            <Tooltip title={t("formulaTooltip")}>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        </div>
        <CodeMirror
          value={formula}
          ref={codemirrorRef}
          className={styles["editor-codemirror"]}
          defaultValue={defaultFormula}
          theme={quietlight}
          basicSetup={{ lineNumbers: false }}
          extensions={[
            ...(spreadsheetLang ? [spreadsheetLang] : []),
            EditorView.lineWrapping,
            mentions([...mentionVariables, ...mentionFunctions]),
            ...EditorViewDecorationExtension(contextVariables),
            formulaSyntaxLinter,
            contextVariablesLinter(contextVariables),
            supportedFunctionsLinter(SUPPORTED_FUNCTIONS),
            ...externalExtensions,
          ]}
          placeholder={t("enterFormulaHere")}
          onChange={(val) => handleEditorChange.run(val)}
        />
      </div>
      {!!error && (
        <div
          className={styles["editor-error"]}
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
      <div className={styles["editor-toolbox"]}>
        <div className={styles["editor-variable-picker"]}>
          <div className={styles["picker-title"]}>{t("variables")}</div>
          <Collapse bordered={false}>
            {contextVariables.map((section) => (
              <Collapse.Panel header={section.section} key={section.section}>
                <List
                  size="small"
                  dataSource={section.variables}
                  renderItem={(item) => (
                    <List.Item
                      className={styles.variables}
                      onClick={() =>
                        insertTextToCodemirror(`$${item.variable}`)
                      }
                    >
                      <span className={styles["variable-label"]}>
                        {item.label}
                      </span>
                      <span className={styles["variable-type"]}>
                        {WidgetDisplayNames[item.widgetType as SupportedWidgetType] ?? item.widgetType}
                      </span>
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
        <div className={styles["editor-funcs-picker"]}>
          <div className={styles["picker-title"]}>{t("functions")}</div>
          <Collapse bordered={false}>
            {functions.map((fns) => (
              <Collapse.Panel header={fns.category} key={fns.category}>
                <List
                  size="small"
                  dataSource={fns.funcs}
                  renderItem={(item) => (
                    <List.Item
                      className={styles.func}
                      onMouseEnter={() => {
                        setHoveredFunction(item.func);
                        setDescription(item.description);
                      }}
                      onMouseLeave={() => {
                        setHoveredFunction(t("usageGuide"));
                        setDescription(defaultDescription);
                      }}
                      onClick={() =>
                        insertTextToCodemirror(`${item.func}()`)
                      }
                    >
                      <span className={styles["func-content"]}>
                        {item.func}
                      </span>
                      <span className={styles["func-name"]}>
                        {item.name}
                      </span>
                    </List.Item>
                  )}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
        <div className={styles["editor-func-description"]}>
          <div className={styles["picker-title"]}>{hoveredFunction}</div>
          <div
            className={styles["description-content"]}
            dangerouslySetInnerHTML={{
              __html: micromark(description.replace(/\n/g, "<br />"), {
                allowDangerousHtml: true,
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;
