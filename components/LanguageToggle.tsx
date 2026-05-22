"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "he" ? "en" : "he")}
      className="text-sm font-medium px-3 py-1 rounded-full border border-gold/40 text-charcoal-light hover:border-gold hover:text-gold transition-colors duration-200"
    >
      {lang === "he" ? "EN" : "עב"}
    </button>
  );
}
