import i18n, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import zh from "./locales/zh";

export const DRAWER_I18N_NS = "drawer";

const drawerI18n: I18nInstance = i18n.createInstance();

drawerI18n.use(initReactI18next).init({
  resources: {
    en: { [DRAWER_I18N_NS]: en },
    zh: { [DRAWER_I18N_NS]: zh },
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: DRAWER_I18N_NS,
  ns: [DRAWER_I18N_NS],
  interpolation: { escapeValue: false },
});

export default drawerI18n;
