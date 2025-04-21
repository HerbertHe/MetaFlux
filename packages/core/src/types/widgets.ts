export type SupportedWidgetType =
  | "Input"
  | "NumberInput"
  | "Date"
  | "Select"
  | "Radio";
// | "Checkbox";

export interface IWidgetOption {
  optionId: string;
  widgetId: string;
  label: string;
  value: string;
}

export interface IWidget {
  widgetId: string;
  label: string;
  description: string;
  placeholder: string;
  widgetType: SupportedWidgetType;
  // TODO funcs
}
