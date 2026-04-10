export type SupportedWidgetType =
  | "Input"
  | "NumberInput"
  | "Date"
  | "Select"
  | "Radio"
  | "Checkbox"
  | "CustomRadio";

export enum WidgetTypeEnum {
  Input = 1,
  Radio = 2,
  Checkbox = 3,
  Select = 4,
  Date = 5,
  CustomRadio = 16,
  NumberInput = 17,
}

export const WidgetTypeEnumDisplayNames: Record<
  keyof typeof WidgetTypeEnum,
  string
> = {
  Input: "Input",
  Radio: "Radio",
  Checkbox: "Checkbox",
  Select: "Select",
  Date: "Date",
  CustomRadio: "Custom Radio",
  NumberInput: "Number Input",
};

export interface IWidgetOption {
  id?: string;
  label: string;
  value: string;
}

export interface IFuncData {
  func: string;
  message: string;
}

export interface IWidgetBase {
  fieldKey: string;
  placeholder: string;
  label: string;
  widgetType: SupportedWidgetType;
  options: IWidgetOption[];
  func?: string;
  description: string;
}

export interface IWidget extends IWidgetBase {
  widgetId: string;
  defaultValue?: string;
  funcList?: IFuncData[];
  extendInfo?: string;
}

export type AvailableWidgetTypeWithOptions = Exclude<
  SupportedWidgetType,
  "Input" | "NumberInput" | "Date"
>;

export const WIDGET_TYPES_WITH_OPTIONS: SupportedWidgetType[] = [
  "Radio",
  "Checkbox",
  "Select",
  "CustomRadio",
];

export function getWidgetTypeFromEnum(
  enumValue: WidgetTypeEnum,
): SupportedWidgetType | undefined {
  const mapping: Record<WidgetTypeEnum, SupportedWidgetType> = {
    [WidgetTypeEnum.Input]: "Input",
    [WidgetTypeEnum.Radio]: "Radio",
    [WidgetTypeEnum.Checkbox]: "Checkbox",
    [WidgetTypeEnum.Select]: "Select",
    [WidgetTypeEnum.Date]: "Date",
    [WidgetTypeEnum.CustomRadio]: "CustomRadio",
    [WidgetTypeEnum.NumberInput]: "NumberInput",
  };
  return mapping[enumValue];
}
