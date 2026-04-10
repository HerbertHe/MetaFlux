import type { Extension } from "@codemirror/state";
import {
  autocompletion,
  type CompletionContext,
  type Completion,
} from "@codemirror/autocomplete";

export function mentions(data: Completion[] = []): Extension {
  return autocompletion({
    override: [
      (context: CompletionContext) => {
        const word = context.matchBefore(/[\$A-Z](\w+)?/);
        if (!word) return null;
        if (word && word.from === word.to && !context.explicit) {
          return null;
        }
        return {
          from: word.from,
          options: [...data],
        };
      },
    ],
  });
}
