"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ThemeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { t } = useLanguage();
  const suggestions = t("form.theme_suggestions") as unknown as string[];

  const chips =
    Array.isArray(suggestions)
      ? suggestions
      : ["ים", "ג'ונגל", "נסיכות", "Unicorn", "חלל", "דינוזאורים"];

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("form.theme_placeholder")}
        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                   placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40
                   text-base transition-all duration-200"
      />
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
              ${
                value === chip
                  ? "bg-gold text-white border-gold shadow-sm"
                  : "bg-white text-charcoal-light border-border hover:border-gold hover:text-gold"
              }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
