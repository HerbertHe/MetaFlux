const zh = {
  // Canvas
  widgets: "组件",
  loadingWidgets: "加载组件中...",
  formDesign: "表单设计",
  dragWidgetsHint: "从左侧面板拖拽组件开始设计",
  properties: "属性",
  selectWidgetHint: "选择一个组件以配置其属性",

  // RenderExampleWidget
  other: "其他",
  enterOtherValue: "请输入其他值",

  // WidgetPropertiesPanel
  fieldProperties: "字段属性",
  linkageRules: "联动规则",
  deleteWidgetConfirm: "确定要删除此组件吗？",
  confirm: "确认",
  cancel: "取消",
  deleteWidget: "删除组件",

  // Common form labels
  label: "标签",
  labelRequired: "请输入标签",
  fieldKey: "字段键",
  fieldKeyUppercase: "字段键必须为大写字母",
  description: "描述",
  placeholder: "占位文本",
  placeholderRequired: "请输入占位文本",
  defaultValue: "默认值",

  // InputPanel
  custom: "自定义",
  formula: "公式",
  editFormula: "编辑公式",
  customDefaultValueNoEqual: "自定义默认值不能以 = 开头",
  enterDefaultValue: "输入默认值...",
  editValidationRules: "编辑校验规则",
  formulaValueMsg: "公式值：{{value}}",
  formulaValueEmpty: "空",

  // Options
  editOptions: "编辑选项",

  // DatePanel
  default: "默认值：",
  selectableRange: "可选范围",
  earliestSelectable: "最早可选",
  latestSelectable: "最晚可选",
  dynamic: "动态",
  static: "静态",
  today: "今天",
  yesterday: "昨天",
  tomorrow: "明天",
  daysAgo7: "7天前",
  daysLater7: "7天后",
  daysAgo30: "30天前",
  daysLater30: "30天后",

  // AvailableOptionsModal
  widgetOptions: "组件选项",
  labelColumn: "标签",
  valueColumn: "值",
  actionsColumn: "操作",
  save: "保存",
  edit: "编辑",
  delete: "删除",
  required: "必填",
  deleteOptionConfirm: "删除此选项？",
  addOption: "+ 添加选项",
  optionUsedInRules: "此选项已在联动规则中使用，请先移除相关规则。",
  saveEditsFirst: "请先保存所有编辑再确认",

  // FuncListModal
  rule: "规则",
  pleaseEnterRule: "请输入规则",
  enterValidationRule: "输入校验规则",
  pleaseEnterMessage: "请输入提示信息",
  message: "提示信息",
  validationMessage: "校验提示信息",
  addValidationRule: "+ 添加校验规则",

  // FormRules
  addRule: "添加规则",
  rulesConfigured: "已配置 {{count}} 条规则",
  rulePrefix: "规则：",
  when: "当",
  and: "且",
  or: "或",
  hide: "隐藏",
  set: "设置",
  toReadOnly: "为只读",
  toWritable: "为可写",
  valueTo: "的值为",
  optionsTo: "的选项为",
  copyAsNewRule: "复制为新规则",
  deleteRuleConfirm: "删除此规则？",
  between: "之间",
  anyOf: "其中之一",

  // LinkageRulesModal
  conflictMsg: "冲突：条件和结果不能引用同一个组件",
  pleaseEnterDescription: "请输入描述",
  match: "匹配",
  conditions: "条件",
  all: "全部",
  any: "任一",
  addCondition: "添加条件",
  selectSection: "请选择分区",
  sectionPlaceholder: "分区",
  widgetPlaceholder: "组件",
  methodPlaceholder: "方法",
  selectWidget: "请选择组件",
  selectMethod: "请选择方法",
  setValue: "设置值",
  then: "则",
  deleteConditionConfirm: "删除此条件？",
  addResult: "添加结果",
  deleteResultConfirm: "删除此结果？",
  possessive: "的",

  // FormulaEditor
  editorDescLine1: "从左侧面板选择字段名称和函数，或直接输入函数",
  editorDescLine2: "示例：`AVERAGE`(number1, number2)",
  usageGuide: "使用指南",
  clearEditor: "清空编辑器",
  formulaTooltip: "含上下文变量的公式结果只能在保存后的预览中验证。",
  enterFormulaHere: "在此输入公式...",
  variables: "变量",
  functions: "函数",
  formulaEditorCleared: "公式编辑器已清空",

  // Items
  selectPlaceholder: "请选择",
  min: "最小值",
  max: "最大值",
};

export default zh;
