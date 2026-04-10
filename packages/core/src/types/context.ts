import type { SupportedWidgetType } from "./widgets";

export interface IContextSectionVariables {
  section: string;
  variables: IContextVariable[];
}

export interface IContextVariable {
  label: string;
  id: string;
  widgetType: SupportedWidgetType;
  variable: string;
}
