import type { SupportedWidgetType } from "../types";

export const WidgetDisplayNames: Record<SupportedWidgetType, string> = {
  Input: "Text Input",
  NumberInput: "Number Input",
  Date: "Date",
  Select: "Select",
  Radio: "Radio",
  Checkbox: "Checkbox",
  CustomRadio: "Custom Radio",
};

export const SupportedWidgetInteractions: SupportedWidgetType[] = [
  "Input",
  "NumberInput",
  "Date",
  "Select",
  "Radio",
  "Checkbox",
  "CustomRadio",
];

export const SupportedWidgetInteractionsWithOptions: SupportedWidgetType[] = [
  "Select",
  "Radio",
  "Checkbox",
  "CustomRadio",
];
