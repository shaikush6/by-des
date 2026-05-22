"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeSelector } from "./ThemeSelector";
import { BudgetSelector } from "./BudgetSelector";
import { OptionalFields } from "./OptionalFields";
import { PartyBrief } from "@/lib/types";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-charcoal mb-2">
      {children}
      {required && <span className="text-gold ms-1">*</span>}
    </label>
  );
}

export function PartyForm() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [theme, setTheme] = useState("");
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState<"low" | "medium" | "high" | "premium" | "">("");

  const [partyDate, setPartyDate] = useState("");
  const [venueType, setVenueType] = useState("");
  const [vibeTags, setVibeTags] = useState<string[]>([]);
  const [stylePref, setStylePref] = useState("");
  const [genderPref, setGenderPref] = useState("");
  const [foodNotes, setFoodNotes] = useState("");
  const [partyLanguage, setPartyLanguage] = useState("");
  const [haveAlready, setHaveAlready] = useState("");
  const [freeNotes, setFreeNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = theme.trim() && kidName.trim() && kidAge && guests && budget;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setError("");
    setSubmitting(true);

    const brief: PartyBrief = {
      theme: theme.trim(),
      kidName: kidName.trim(),
      kidAge: parseInt(kidAge),
      guestsCount: parseInt(guests),
      budgetRange: budget as PartyBrief["budgetRange"],
      language: lang,
      ...(partyDate && { partyDate }),
      ...(venueType && { venueType }),
      ...(vibeTags.length && { vibeTags }),
      ...(stylePref && { stylePref }),
      ...(genderPref && { genderPref }),
      ...(foodNotes.trim() && { foodNotes: foodNotes.trim() }),
      ...(partyLanguage && { partyLanguage }),
      ...(haveAlready.trim() && { haveAlready: haveAlready.trim() }),
      ...(freeNotes.trim() && { freeNotes: freeNotes.trim() }),
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      sessionStorage.setItem("bydes_plan", JSON.stringify(data));
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Required section */}
      <div className="space-y-5">
        {/* Theme */}
        <div>
          <FieldLabel required>{t("form.theme_label")}</FieldLabel>
          <ThemeSelector value={theme} onChange={setTheme} />
        </div>

        {/* Name + Age row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <FieldLabel required>{t("form.kid_name_label")}</FieldLabel>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder={t("form.kid_name_placeholder")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
            />
          </div>
          <div>
            <FieldLabel required>{t("form.kid_age_label")}</FieldLabel>
            <input
              type="number"
              value={kidAge}
              onChange={(e) => setKidAge(e.target.value)}
              placeholder={t("form.kid_age_placeholder")}
              min="1"
              max="18"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-center
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <FieldLabel required>{t("form.guests_label")}</FieldLabel>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder={t("form.guests_placeholder")}
            min="1"
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                       placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
          />
        </div>

        {/* Budget */}
        <div>
          <FieldLabel required>{t("form.budget_label")}</FieldLabel>
          <BudgetSelector value={budget} onChange={setBudget} />
        </div>
      </div>

      {/* Optional section */}
      <OptionalFields
        partyDate={partyDate} onPartyDate={setPartyDate}
        venueType={venueType} onVenueType={setVenueType}
        vibeTags={vibeTags} onVibeTags={setVibeTags}
        stylePref={stylePref} onStylePref={setStylePref}
        genderPref={genderPref} onGenderPref={setGenderPref}
        foodNotes={foodNotes} onFoodNotes={setFoodNotes}
        partyLanguage={partyLanguage} onPartyLanguage={setPartyLanguage}
        haveAlready={haveAlready} onHaveAlready={setHaveAlready}
        freeNotes={freeNotes} onFreeNotes={setFreeNotes}
      />

      {error && (
        <p className="text-destructive text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className="w-full py-4 bg-gold text-white font-semibold rounded-2xl text-lg
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-gold-dark transition-all duration-300 active:scale-[0.98]
                   shadow-md shadow-gold/20"
      >
        {t("form.submit")}
      </button>
    </form>
  );
}

function LoadingState() {
  const { t } = useLanguage();
  const steps = t("loading.steps") as unknown as string[];
  const [step, setStepIdx] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => (i + 1) % (Array.isArray(steps) ? steps.length : 1));
    }, 2500);
    return () => clearInterval(interval);
  });

  const stepsArr = Array.isArray(steps) ? steps : ["מכין..."];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🎉</div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-heading text-xl text-charcoal">{t("loading.title")}</p>
        <p className="text-charcoal-light text-sm min-h-[20px] transition-all duration-500">
          {stepsArr[step]}
        </p>
      </div>
    </div>
  );
}
