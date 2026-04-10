import { useState, useCallback } from "react";
import {
  Typography,
  Button,
  Tabs,
  Space,
  Drawer,
  message,
  Tag,
  Tooltip,
  Input,
  Popconfirm,
} from "antd";
import {
  CodeOutlined,
  CopyOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { IWidgetBase } from "@metaflux/core";
import "@metaflux/drawer/styles";
import {
  Canvas,
  DrawerStoreProvider,
  useDrawerStore,
} from "@metaflux/drawer";

const { Title, Text } = Typography;

const AVAILABLE_WIDGETS: IWidgetBase[] = [
  {
    fieldKey: "text_input",
    placeholder: "Enter text...",
    label: "Text Input",
    widgetType: "Input",
    options: [],
    description: "Single-line text input",
  },
  {
    fieldKey: "number_input",
    placeholder: "Enter number...",
    label: "Number Input",
    widgetType: "NumberInput",
    options: [],
    description: "Numeric input",
  },
  {
    fieldKey: "date_picker",
    placeholder: "Select date...",
    label: "Date Picker",
    widgetType: "Date",
    options: [],
    description: "Date selection",
  },
  {
    fieldKey: "select",
    placeholder: "Select option...",
    label: "Select",
    widgetType: "Select",
    options: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ],
    description: "Dropdown select",
  },
  {
    fieldKey: "radio",
    placeholder: "",
    label: "Radio Group",
    widgetType: "Radio",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    description: "Radio button group",
  },
  {
    fieldKey: "checkbox",
    placeholder: "",
    label: "Checkbox Group",
    widgetType: "Checkbox",
    options: [
      { label: "Item 1", value: "item1" },
      { label: "Item 2", value: "item2" },
      { label: "Item 3", value: "item3" },
    ],
    description: "Checkbox group",
  },
  {
    fieldKey: "custom_radio",
    placeholder: "",
    label: "Custom Radio",
    widgetType: "CustomRadio",
    options: [
      { label: "Agree", value: "agree" },
      { label: "Disagree", value: "disagree" },
    ],
    description: "Radio with custom 'Other' option",
  },
];

const FormDesigner = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [jsonDrawerOpen, setJsonDrawerOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState("");

  const {
    sections,
    widgets,
    getSections,
    updateSections,
    getWidgets,
    getRules,
    updateWidgets,
    updateRules,
  } = useDrawerStore();

  const totalWidgets = widgets.flat().length;
  const currentSectionWidgets = widgets[activeSection]?.length ?? 0;
  const rules = getRules();

  const getExportData = useCallback(
    () => ({
      sections: getSections(),
      widgets: getWidgets(),
      rules: getRules(),
    }),
    [sections, widgets],
  );

  const handleCopyJson = () => {
    const data = getExportData();
    navigator.clipboard
      .writeText(JSON.stringify(data, null, 2))
      .then(() => message.success("JSON copied to clipboard"));
  };

  const handleExportFile = () => {
    const data = getExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `metaflux-form-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success("Exported successfully");
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      if (data.sections && data.widgets) {
        updateSections(data.sections);
        updateWidgets(data.widgets);
        if (data.rules) updateRules(data.rules);
        setActiveSection(0);
        setImportModalOpen(false);
        setImportJson("");
        message.success("Imported successfully");
      } else {
        message.error("Invalid format: missing sections or widgets");
      }
    } catch {
      message.error("Invalid JSON");
    }
  };

  const handleReset = () => {
    updateSections(["Section 1"]);
    updateWidgets([[]]);
    updateRules([]);
    setActiveSection(0);
    message.info("Form reset");
  };

  const handleAddSection = () => {
    const cur = getSections();
    const newSections = [...cur, `Section ${cur.length + 1}`];
    updateSections(newSections);
    setActiveSection(newSections.length - 1);
  };

  const handleRemoveSection = (index: number) => {
    const cur = getSections();
    if (cur.length <= 1) {
      message.warning("At least one section is required");
      return;
    }
    const newSections = cur.filter((_, i) => i !== index);
    updateSections(newSections);
    if (activeSection >= newSections.length) {
      setActiveSection(newSections.length - 1);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            MetaFlux Form Builder
          </Title>
          <Space size={4}>
            <Tag color="blue">{totalWidgets} widgets</Tag>
            <Tag color="green">{rules.length} rules</Tag>
            <Tag>{sections.length} sections</Tag>
          </Space>
        </div>

        <Space>
          <Tooltip title="Import JSON">
            <Button
              icon={<ImportOutlined />}
              onClick={() => setImportModalOpen(true)}
            />
          </Tooltip>
          <Tooltip title="Export JSON file">
            <Button icon={<ExportOutlined />} onClick={handleExportFile} />
          </Tooltip>
          <Button
            icon={<CodeOutlined />}
            onClick={() => setJsonDrawerOpen(true)}
          >
            Preview
          </Button>
          <Popconfirm
            title="Reset the entire form?"
            description="All widgets, rules and sections will be cleared."
            onConfirm={handleReset}
            okText="Reset"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Reset form">
              <Button icon={<ReloadOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>

      <div
        style={{
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Tabs
          activeKey={String(activeSection)}
          onChange={(key) => setActiveSection(Number(key))}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "add") handleAddSection();
            else handleRemoveSection(Number(targetKey));
          }}
          items={sections.map((name, idx) => ({
            key: String(idx),
            label: (
              <span>
                {name}
                <Text
                  type="secondary"
                  style={{ fontSize: 12, marginLeft: 6 }}
                >
                  ({widgets[idx]?.length ?? 0})
                </Text>
              </span>
            ),
            closable: sections.length > 1,
          }))}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: 16,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <div style={{ height: "100%" }}>
          <Canvas
            sectionIndex={activeSection}
            availableWidgets={AVAILABLE_WIDGETS}
          />
        </div>
      </div>

      <div
        style={{
          padding: "8px 24px",
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "#999",
        }}
      >
        <span>
          Current section: <b>{sections[activeSection]}</b> ·{" "}
          {currentSectionWidgets} widget(s)
        </span>
        <span>
          Drag widgets from the left panel or click to add · Right panel for
          properties & linkage rules
        </span>
      </div>

      <Drawer
        title="Form Configuration JSON"
        placement="right"
        width={560}
        open={jsonDrawerOpen}
        onClose={() => setJsonDrawerOpen(false)}
        extra={
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyJson}
              size="small"
            >
              Copy
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExportFile}
              size="small"
              type="primary"
            >
              Export
            </Button>
          </Space>
        }
      >
        <pre
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #f0f0f0",
            fontSize: 12,
            lineHeight: 1.6,
            overflow: "auto",
            maxHeight: "calc(100vh - 140px)",
          }}
        >
          {JSON.stringify(getExportData(), null, 2)}
        </pre>
      </Drawer>

      <Drawer
        title="Import Form Configuration"
        placement="right"
        width={520}
        open={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
          setImportJson("");
        }}
        extra={
          <Button type="primary" onClick={handleImport} disabled={!importJson}>
            Import
          </Button>
        }
      >
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          Paste the exported JSON below to restore a form configuration.
        </Text>
        <Input.TextArea
          rows={24}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder='{"sections": [...], "widgets": [...], "rules": [...]}'
          style={{ fontFamily: "monospace", fontSize: 12 }}
        />
      </Drawer>
    </div>
  );
};

const Home = () => (
  <DrawerStoreProvider sections={["Section 1"]}>
    <FormDesigner />
  </DrawerStoreProvider>
);

export default Home;
