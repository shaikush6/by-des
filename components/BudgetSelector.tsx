"use client";

import { useLanguage } from "@/context/LanguageContext";

type BudgetRange = "low" | "medium" | "high" | "premium";

interface BudgetSelectorProps {
  value: BudgetRange | "";
  onChange: (value: BudgetRange) => void;
}

const options: BudgetRange[] = ["low", "medium", "high", "premium"];

export function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-200
            ${
              value === option
                ? "border-gold bg-gold/10 shadow-sm"
                : "border-border bg-white hover:border-gold/50"
            }`}
        >
          <span
            className={`text-sm font-semibold ${
              value === option ? "text-gold" : "text-charcoal"
            }`}
          >
            {t(`form.budget_options.${option}`)}
          </span>
          <span
            className={`text-xs mt-0.5 ${
              value === option ? "text-gold-dark" : "text-muted-foreground"
            }`}
          >
            {t(`form.budget_ranges.${option}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
