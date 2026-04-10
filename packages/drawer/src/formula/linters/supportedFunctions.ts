import { linter } from "@codemirror/lint";
import { validateSupportedFunctions } from "@metaflux/core";

export const supportedFunctionsLinter = (funcs: string[]) => {
  return linter((view) => {
    return validateSupportedFunctions(
      view.state.doc.toString(),
      funcs,
    ).map(({ message, location }) => ({
      from: location?.start?.offset ?? 0,
      to: location?.end?.offset ?? 0,
      message,
      severity: "error" as const,
    }));
  });
};
