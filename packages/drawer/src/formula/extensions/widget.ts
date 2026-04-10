import {
  Decoration,
  EditorView,
  RangeSet,
  WidgetType,
  type Extension,
  type Range,
} from "@uiw/react-codemirror";
import type { RangeValue } from "@codemirror/state";
import type { IContextSectionVariables } from "@metaflux/core";

export class VariableWidget extends WidgetType {
  #label: string;
  #variable: string;
  constructor(label: string, variable: string) {
    super();
    this.#label = label;
    this.#variable = variable;
  }
  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.textContent = this.#label;
    span.classList.add("variable-widget");
    span.title = this.#variable;
    return span;
  }

  ignoreEvent(): boolean {
    return true;
  }
}

export const EditorViewDecorationExtension = (
  contextVariables: IContextSectionVariables[],
): Extension[] => {
  return [
    EditorView.atomicRanges.of((view) => {
      const ranges: Range<RangeValue>[] = [];
      const content = view.state.doc.toString();
      const regexp = /\$[a-zA-Z_0-9][\-]?[a-zA-Z0-9_]*/g;
      const vars = content.match(regexp) ?? [];
      let idx = 0;
      let pos = content.indexOf(vars[idx]);

      while (pos !== -1) {
        ranges.push({
          from: pos,
          to: pos + vars[idx].length,
          value: vars[idx] as any,
        });
        idx++;
        pos = content.indexOf(vars[idx], pos + 1);
      }

      return RangeSet.of(ranges);
    }),
    EditorView.decorations.of((view) => {
      const variables = new Map<string, string>();
      const variableKeys: string[] = [];
      contextVariables.forEach(({ section, variables: vs }) => {
        vs.forEach(({ variable, label }) => {
          variables.set(`$${variable}`, `${section}-${label}`);
          variableKeys.push(`$${variable}`);
        });
      });

      const widgets: Range<Decoration>[] = [];
      const content = view.state.doc.toString();
      const regexp = /\$[a-zA-Z_0-9][\-]?[a-zA-Z0-9_]*/g;
      const vars = content.match(regexp) ?? [];
      let idx = 0;
      let pos = content.indexOf(vars[idx]);

      while (pos !== -1) {
        if (variableKeys.includes(vars[idx])) {
          widgets.push(
            Decoration.replace({
              widget: new VariableWidget(
                variables.get(vars[idx])!,
                vars[idx],
              ),
              inclusive: true,
            }).range(pos, pos + vars[idx].length),
          );
        }
        idx++;
        pos = content.indexOf(vars[idx], pos + 1);
      }

      return widgets.length > 0 ? Decoration.set(widgets) : Decoration.none;
    }),
  ];
};
