import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import { I18nextProvider, useTranslation } from "react-i18next";
import type {
  IWidget,
  IModuleRule,
  IContextSectionVariables,
  IContextVariable,
} from "@metaflux/core";
import drawerI18n, { DRAWER_I18N_NS } from "../i18n";

export type DrawerLang = "en" | "zh";

export interface DrawerState {
  sections: string[];
  widgets: IWidget[][];
  rules: IModuleRule[];
  lang: DrawerLang;
}

interface WidgetActions {
  getSections: () => string[];
  updateSections: (sections: string[]) => void;
  getWidgets: () => IWidget[][];
  updateWidgets: (widgets: IWidget[][]) => void;
  getSectionWidgets: (sectionIndex: number) => IWidget[] | undefined;
  updateSectionWidgets: (
    sectionIndex: number,
    widgets: IWidget[] | (() => IWidget[]),
  ) => void;
  getSectionWidget: (sectionIndex: number, widgetId: string) => IWidget;
  updateSectionWidget: (
    sectionIndex: number,
    widgetId: string,
    item: IWidget,
  ) => void;
  removeSectionWidget: (sectionIndex: number, widgetId: string) => void;
  getContextVariables: (filterId: string) => IContextSectionVariables[];
}

interface LangActions {
  setLang: (lang: DrawerLang) => void;
}

interface RulesActions {
  getRules: () => IModuleRule[];
  updateRules: (rules: IModuleRule[]) => void;
  validateRemovedWidgetsInRules: () => [boolean, [number, string][] | undefined];
}

export type DrawerActions = WidgetActions & RulesActions & LangActions;

const StoreContext = createContext<{
  useDrawerStore?: UseBoundStore<StoreApi<DrawerState & DrawerActions>>;
}>({});

export const useDrawerStore = () => {
  const { useDrawerStore: useStore } = useContext(StoreContext);
  return useStore!();
};

export interface DrawerStoreProviderProps {
  children: ReactElement;
  sections?: string[];
  lang?: DrawerLang;
}

function LangSync() {
  const { lang } = useDrawerStore();
  const { i18n } = useTranslation(DRAWER_I18N_NS);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return null;
}

export function DrawerStoreProvider({
  children,
  sections: initialSections = ["Section 1"],
  lang: initialLang = "en",
}: DrawerStoreProviderProps) {
  const useStore = useMemo(() => {
    return create<DrawerState & DrawerActions>((set, get) => ({
      sections: initialSections,
      widgets: initialSections.map(() => []),
      rules: [],
      lang: initialLang,

      setLang: (lang: DrawerLang) => set({ lang }),

      getSections: () => get().sections,
      updateSections: (sections: string[]) => {
        const currentWidgets = get().widgets;
        const newWidgets = sections.map(
          (_, idx) => currentWidgets[idx] ?? [],
        );
        set({ sections, widgets: newWidgets });
      },

      getWidgets: () => JSON.parse(JSON.stringify(get().widgets)),
      updateWidgets: (widgets: IWidget[][]) => set({ widgets }),

      getSectionWidgets: (sectionIndex: number) => {
        const widgetSection = get().widgets[sectionIndex];
        if (!widgetSection) return undefined;
        return JSON.parse(JSON.stringify(widgetSection));
      },

      updateSectionWidgets: (
        sectionIndex: number,
        widgets: IWidget[] | (() => IWidget[]),
      ) => {
        const widgetsCopy = JSON.parse(JSON.stringify(get().widgets)) as IWidget[][];
        while (widgetsCopy.length <= sectionIndex) {
          widgetsCopy.push([]);
        }
        widgetsCopy[sectionIndex] =
          typeof widgets === "function" ? widgets() : widgets;
        set({ widgets: widgetsCopy });
      },

      getSectionWidget: (sectionIndex: number, widgetId: string) => {
        const widget = get().widgets[sectionIndex]?.find(
          (w) => w.widgetId === widgetId,
        );
        return widget ? JSON.parse(JSON.stringify(widget)) : ({} as IWidget);
      },

      updateSectionWidget: (
        sectionIndex: number,
        widgetId: string,
        item: IWidget,
      ) => {
        const widgetsCopy = JSON.parse(JSON.stringify(get().widgets)) as IWidget[][];
        const idx = widgetsCopy[sectionIndex]?.findIndex(
          (w) => w.widgetId === widgetId,
        );
        if (idx !== undefined && idx >= 0) {
          widgetsCopy[sectionIndex][idx] = item;
          set({ widgets: widgetsCopy });
        }
      },

      removeSectionWidget: (sectionIndex: number, widgetId: string) => {
        const widgetsCopy = JSON.parse(JSON.stringify(get().widgets)) as IWidget[][];
        widgetsCopy[sectionIndex] = widgetsCopy[sectionIndex]?.filter(
          (w) => w.widgetId !== widgetId,
        );
        set({ widgets: widgetsCopy });
      },

      getContextVariables: (filterId: string) => {
        const widgetsCopy = JSON.parse(JSON.stringify(get().widgets)) as IWidget[][];
        const sections = get().sections;
        return widgetsCopy.map((sectionWidgets, idx) => ({
          section: sections[idx] || `Section ${idx + 1}`,
          variables: sectionWidgets
            .filter((w) => w.widgetId !== filterId)
            .map(
              (w) =>
                ({
                  label: w.label,
                  id: w.widgetId,
                  variable: `${idx}-${w.fieldKey}`,
                  widgetType: w.widgetType,
                }) as IContextVariable,
            ),
        }));
      },

      getRules: () => JSON.parse(JSON.stringify(get().rules)),
      updateRules: (rules) => set({ rules }),

      validateRemovedWidgetsInRules: () => {
        const widgetIds = get()
          .widgets.flat(1)
          .filter(Boolean)
          .map((w) => w.widgetId);

        const ruleEntries = get().rules.map(
          ({ conditions, results, description }) => {
            const conditionIds = conditions.map((c) => c.widgetId);
            const resultIds = results.map((r) => r.widgetId);
            return [conditionIds, resultIds, description] as const;
          },
        );

        const errors = ruleEntries
          .map(([conditionIds, resultIds, description], idx) => {
            const hasInvalidCondition = conditionIds.some(
              (id) => !widgetIds.includes(id),
            );
            const hasInvalidResult = resultIds.some(
              (id) => !widgetIds.includes(id),
            );
            let msg = "";

            if (hasInvalidCondition) {
              msg += `"${description}" condition references a deleted widget`;
            }
            if (hasInvalidResult) {
              msg +=
                (msg ? ", " : "") + "result references a deleted widget";
            }

            return msg ? ([idx, msg] as [number, string]) : undefined;
          })
          .filter(Boolean) as [number, string][];

        if (errors.length === 0) return [false, undefined];
        return [true, errors];
      },
    }));
  }, []);

  useEffect(() => {
    useStore.getState().setLang(initialLang);
  }, [initialLang]);

  return (
    <I18nextProvider i18n={drawerI18n}>
      <StoreContext.Provider value={{ useDrawerStore: useStore }}>
        <LangSync />
        {children}
      </StoreContext.Provider>
    </I18nextProvider>
  );
}
