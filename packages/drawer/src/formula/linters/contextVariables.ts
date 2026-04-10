import { linter } from "@codemirror/lint";
import {
  validateContextVariables,
  type IContextSectionVariables,
} from "@metaflux/core";

export const contextVariablesLinter = (
  contextVariables: IContextSectionVariables[],
) => {
  return linter((view) => {
    return validateContextVariables(
      view.state.doc.toString(),
      contextVariables,
    ).map(({ message, location }) => ({
      from: location?.start?.offset ?? 0,
      to: location?.end?.offset ?? 0,
      message,
      severity: "error" as const,
    }));
  });
};
