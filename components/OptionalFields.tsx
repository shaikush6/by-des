"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VibeTags } from "./VibeTags";

interface OptionalFieldsProps {
  partyDate: string;
  onPartyDate: (v: string) => void;
  venueType: string;
  onVenueType: (v: string) => void;
  vibeTags: string[];
  onVibeTags: (v: string[]) => void;
  stylePref: string;
  onStylePref: (v: string) => void;
  genderPref: string;
  onGenderPref: (v: string) => void;
  foodNotes: string;
  onFoodNotes: (v: string) => void;
  partyLanguage: string;
  onPartyLanguage: (v: string) => void;
  haveAlready: string;
  onHaveAlready: (v: string) => void;
  freeNotes: string;
  onFreeNotes: (v: string) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-charcoal-light mb-2">
      {children}
    </label>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
            ${
              value === opt
                ? "bg-charcoal text-white border-charcoal"
                : "bg-white text-charcoal-light border-border hover:border-charcoal/40"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function OptionalFields(props: OptionalFieldsProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const venueOptions = t("form.venue_options") as unknown as string[];
  const styleOptions = t("form.style_options") as unknown as string[];
  const genderOptions = t("form.gender_options") as unknown as string[];
  const partyLangOptions = t("form.party_lang_options") as unknown as string[];

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-4 text-charcoal-light hover:text-charcoal transition-colors duration-200"
      >
        <span className="text-sm font-medium">
          {open ? t("form.optional_toggle_close") : t("form.optional_toggle_open")}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-border/50 pt-4">
          {/* Date */}
          <div>
            <FieldLabel>{t("form.date_label")}</FieldLabel>
            <input
              type="date"
              value={props.partyDate}
              onChange={(e) => props.onPartyDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                         focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
            />
          </div>

          {/* Venue */}
          <div>
            <FieldLabel>{t("form.venue_label")}</FieldLabel>
            <ChipGroup
              options={Array.isArray(venueOptions) ? venueOptions : []}
              value={props.venueType}
              onChange={props.onVenueType}
            />
          </div>

          {/* Vibe tags */}
          <div>
            <FieldLabel>{t("form.vibe_label")}</FieldLabel>
            <VibeTags
              selected={props.vibeTags}
              onChange={props.onVibeTags}
              optionsKey="form.vibe_options"
            />
          </div>

          {/* Style */}
          <div>
            <FieldLabel>{t("form.style_label")}</FieldLabel>
            <ChipGroup
              options={Array.isArray(styleOptions) ? styleOptions : []}
              value={props.stylePref}
              onChange={props.onStylePref}
            />
          </div>

          {/* Gender */}
          <div>
            <FieldLabel>{t("form.gender_label")}</FieldLabel>
            <ChipGroup
              options={Array.isArray(genderOptions) ? genderOptions : []}
              value={props.genderPref}
              onChange={props.onGenderPref}
            />
          </div>

          {/* Food notes */}
          <div>
            <FieldLabel>{t("form.food_label")}</FieldLabel>
            <input
              type="text"
              value={props.foodNotes}
              onChange={(e) => props.onFoodNotes(e.target.value)}
              placeholder={t("form.food_placeholder")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
            />
          </div>

          {/* Party language */}
          <div>
            <FieldLabel>{t("form.party_lang_label")}</FieldLabel>
            <ChipGroup
              options={Array.isArray(partyLangOptions) ? partyLangOptions : []}
              value={props.partyLanguage}
              onChange={props.onPartyLanguage}
            />
          </div>

          {/* Have already */}
          <div>
            <FieldLabel>{t("form.have_label")}</FieldLabel>
            <input
              type="text"
              value={props.haveAlready}
              onChange={(e) => props.onHaveAlready(e.target.value)}
              placeholder={t("form.have_placeholder")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base"
            />
          </div>

          {/* Free notes */}
          <div>
            <FieldLabel>{t("form.notes_label")}</FieldLabel>
            <textarea
              value={props.freeNotes}
              onChange={(e) => props.onFreeNotes(e.target.value)}
              placeholder={t("form.notes_placeholder")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 text-base resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
