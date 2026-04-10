const en = {
  // Canvas
  widgets: "Widgets",
  loadingWidgets: "Loading widgets...",
  formDesign: "Form Design",
  dragWidgetsHint: "Drag widgets from the left panel to start designing",
  properties: "Properties",
  selectWidgetHint: "Select a widget to configure its properties",

  // RenderExampleWidget
  other: "Other",
  enterOtherValue: "Enter other value",

  // WidgetPropertiesPanel
  fieldProperties: "Field Properties",
  linkageRules: "Linkage Rules",
  deleteWidgetConfirm: "Are you sure you want to delete this widget?",
  confirm: "Confirm",
  cancel: "Cancel",
  deleteWidget: "Delete Widget",

  // Common form labels
  label: "Label",
  labelRequired: "Please enter a label",
  fieldKey: "Field Key",
  fieldKeyUppercase: "Field key must be uppercase letters only",
  description: "Description",
  placeholder: "Placeholder",
  placeholderRequired: "Please enter placeholder text",
  defaultValue: "Default Value",

  // InputPanel
  custom: "Custom",
  formula: "Formula",
  editFormula: "Edit Formula",
  customDefaultValueNoEqual: "Custom default value must not start with =",
  enterDefaultValue: "Enter default value...",
  editValidationRules: "Edit Validation Rules",
  formulaValueMsg: "Formula value: {{value}}",
  formulaValueEmpty: "empty",

  // Options
  editOptions: "Edit Options",

  // DatePanel
  default: "Default:",
  selectableRange: "Selectable Range",
  earliestSelectable: "Earliest selectable",
  latestSelectable: "Latest selectable",
  dynamic: "Dynamic",
  static: "Static",
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
  daysAgo7: "7 days ago",
  daysLater7: "7 days later",
  daysAgo30: "30 days ago",
  daysLater30: "30 days later",

  // AvailableOptionsModal
  widgetOptions: "Widget Options",
  labelColumn: "Label",
  valueColumn: "Value",
  actionsColumn: "Actions",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  required: "Required",
  deleteOptionConfirm: "Delete this option?",
  addOption: "+ Add Option",
  optionUsedInRules:
    "This option is used in linkage rules. Please remove the related rules first.",
  saveEditsFirst: "Please save all edits before confirming",

  // FuncListModal
  rule: "Rule",
  pleaseEnterRule: "Please enter a rule",
  enterValidationRule: "Enter validation rule",
  pleaseEnterMessage: "Please enter a message",
  message: "Message",
  validationMessage: "Validation message",
  addValidationRule: "+ Add Validation Rule",

  // FormRules
  addRule: "Add Rule",
  rulesConfigured: "{{count}} rules configured",
  rulePrefix: "Rule: ",
  when: "When",
  and: "AND",
  or: "OR",
  hide: "Hide",
  set: "Set",
  toReadOnly: "to read-only",
  toWritable: "to writable",
  valueTo: "value to",
  optionsTo: "options to",
  copyAsNewRule: "Copy as new rule",
  deleteRuleConfirm: "Delete this rule?",
  between: "between",
  anyOf: "any of",

  // LinkageRulesModal
  conflictMsg:
    "Conflict: condition and result cannot reference the same widget",
  pleaseEnterDescription: "Please enter a description",
  match: "Match",
  conditions: "conditions",
  all: "All",
  any: "Any",
  addCondition: "Add Condition",
  selectSection: "Select section",
  sectionPlaceholder: "Section",
  widgetPlaceholder: "Widget",
  methodPlaceholder: "Method",
  selectWidget: "Select widget",
  selectMethod: "Select method",
  setValue: "Set value",
  then: "then",
  deleteConditionConfirm: "Delete this condition?",
  addResult: "Add Result",
  deleteResultConfirm: "Delete this result?",
  possessive: "'s",

  // FormulaEditor
  editorDescLine1:
    "Select field names and functions from the left panel, or type a function",
  editorDescLine2: "Example: `AVERAGE`(number1, number2)",
  usageGuide: "Usage Guide",
  clearEditor: "Clear editor",
  formulaTooltip:
    "Formula results with context variables can only be verified in preview after saving.",
  enterFormulaHere: "Enter formula here...",
  variables: "Variables",
  functions: "Functions",
  formulaEditorCleared: "Formula editor cleared",

  // Items
  selectPlaceholder: "Select",
  min: "Min",
  max: "Max",
};

export default en;
