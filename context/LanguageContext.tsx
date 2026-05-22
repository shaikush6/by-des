"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import he from "@/messages/he.json";
import en from "@/messages/en.json";

type Lang = "he" | "en";
type Messages = typeof he;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("he");

  useEffect(() => {
    const stored = localStorage.getItem("bydes_lang") as Lang | null;
    if (stored === "en" || stored === "he") setLangState(stored);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("bydes_lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const messages: Messages = lang === "he" ? he : (en as Messages);

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t, dir: lang === "he" ? "rtl" : "ltr" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
