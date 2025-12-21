import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { translations, DEFAULT_LANG } from "./translations";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return window.localStorage.getItem("lang") || DEFAULT_LANG;
  });

  useEffect(() => {
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    return (key) => translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
