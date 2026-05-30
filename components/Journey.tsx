"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useView } from "@/context/ViewContext";
import { PartyBrief, ItemCategory, PartyItem } from "@/lib/types";
import { ItemPicker } from "./ItemPicker";

// ─── Types ───────────────────────────────────────────────────────────────────

type BudgetRange = "low" | "medium" | "high" | "premium";

interface BriefState {
  theme: string;
  kidName: string;
  kidAge: string;
  guests: string;
  budget: BudgetRange | "";
  venueType: string;
  vibeTags: string[];
  stylePref: string;
  genderPref: string;
  freeNotes: string;
}

// ─── Field option presets ────────────────────────────────────────────────────

const THEMES_HE = ["ים", "ג'ונגל", "נסיכות", "יוניקורן", "חלל", "קרקס", "דינוזאורים", "ספארי"];
const THEMES_EN = ["Beach", "Jungle", "Princess", "Unicorn", "Space", "Circus", "Dinosaurs", "Safari"];

const AGE_CHIPS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const GUEST_CHIPS = ["10", "20", "30", "50"];

const BUDGET_OPTIONS = [
  { id: "low",     emoji: "💛", he: "חסכוני",   en: "Budget",   range: "₪300-600" },
  { id: "medium",  emoji: "✨", he: "רגיל",     en: "Standard", range: "₪600-1,200" },
  { id: "high",    emoji: "🌟", he: "מיוחד",    en: "Special",  range: "₪1,200-2,500" },
  { id: "premium", emoji: "👑", he: "פרימיום",  en: "Premium",  range: "₪2,500+" },
] as const;

const VENUE_HE = ["בית", "אולם", "גינה", "חוף", "פארק"];
const VENUE_EN = ["Home", "Event Hall", "Garden", "Beach", "Park"];
const STYLE_HE = ["אלגנטי", "צבעוני", "מינימליסט", "בוהו", "רטרו"];
const STYLE_EN = ["Elegant", "Colorful", "Minimalist", "Boho", "Retro"];

// ─── Small UI helpers ────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-charcoal mb-2">
      {children}
      {required && <span className="text-gold ms-1">*</span>}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-150
        ${active
          ? "bg-gold text-white border-gold shadow-sm"
          : "bg-white text-charcoal border-border hover:border-gold hover:text-gold"
        }`}
    >
      {children}
    </button>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-2xl border-2 border-border bg-white text-charcoal text-base
                  placeholder:text-muted-foreground focus:outline-none focus:border-gold
                  transition-colors ${props.className ?? ""}`}
    />
  );
}

// ─── Field card wrapper ──────────────────────────────────────────────────────

function FieldCard({
  title,
  hint,
  children,
  required,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-border/60 p-5 shadow-sm">
      <FieldLabel required={required}>{title}</FieldLabel>
      {hint && <p className="text-xs text-muted-foreground mb-3 -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 text-center bg-cream">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🎉</div>
      </div>
      <div>
        <h2 className="font-heading text-xl text-charcoal mb-2">By Des</h2>
        <p className="text-charcoal-light text-base">{message}</p>
      </div>
    </div>
  );
}

// ─── Main Journey ─────────────────────────────────────────────────────────────

type Phase = "brief" | "items" | "generating";

export function Journey() {
  const { lang } = useLanguage();
  const { effective } = useView();
  const router = useRouter();
  const isHe = lang === "he";
  const isDesktop = effective === "desktop";

  const [phase, setPhase] = useState<Phase>("brief");
  const [loadingMessage, setLoadingMessage] = useState("");

  const [brief, setBrief] = useState<BriefState>({
    theme: "", kidName: "", kidAge: "", guests: "",
    budget: "", venueType: "", vibeTags: [], stylePref: "", genderPref: "", freeNotes: "",
  });
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [selectedItems, setSelectedItems] = useState<PartyItem[]>([]);

  const updateBrief = useCallback(<K extends keyof BriefState>(k: K, v: BriefState[K]) => {
    setBrief((b) => ({ ...b, [k]: v }));
  }, []);

  // Required fields: theme, kidName, kidAge, guests, budget
  const canSubmit =
    !!brief.theme.trim() &&
    !!brief.kidName.trim() &&
    parseInt(brief.kidAge) > 0 &&
    parseInt(brief.guests) > 0 &&
    !!brief.budget;

  // Build PartyBrief for the API
  const buildPartyBrief = (): PartyBrief => ({
    theme: brief.theme,
    kidName: brief.kidName,
    kidAge: parseInt(brief.kidAge),
    guestsCount: parseInt(brief.guests),
    budgetRange: brief.budget as BudgetRange,
    language: lang,
    ...(brief.venueType && { venueType: brief.venueType }),
    ...(brief.stylePref && { stylePref: brief.stylePref }),
    ...(brief.genderPref && { genderPref: brief.genderPref }),
    ...(brief.freeNotes && { freeNotes: brief.freeNotes }),
  });

  // After completing the brief, load items
  const finishBrief = async () => {
    if (!canSubmit) return;
    setLoadingMessage(isHe ? "Des מנתחת את המסיבה שלך..." : "Des is analyzing your party...");
    setPhase("items");

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPartyBrief()),
      });

      const bodyText = await res.text();
      let data: { categories?: ItemCategory[]; error?: string } = {};
      try {
        data = JSON.parse(bodyText);
      } catch {
        throw new Error(isHe ? "הבקשה ארכה יותר מדי, נסי שוב" : "Request took too long, try again");
      }
      if (!res.ok) throw new Error(data.error || (isHe ? "משהו השתבש" : "Something went wrong"));

      const cats: ItemCategory[] = data.categories ?? [];
      setCategories(cats);
      const defaults = cats.flatMap((c) => c.items.filter((i) => i.defaultSelected));
      setSelectedItems(defaults);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[items]", msg);
      setLoadingMessage(msg || (isHe ? "משהו השתבש, נסי שוב" : "Something went wrong"));
    }
  };

  // Generate plan from selected items
  const handleGenerate = async () => {
    setPhase("generating");
    const msgs = isHe
      ? ["Des בונה לך מסיבה מושלמת...", "בוחרת מוצרים...", "מעצבת את החבילות...", "יוצרת את התמונה..."]
      : ["Des is building your perfect party...", "Selecting products...", "Designing packages...", "Creating your moodboard..."];

    let i = 0;
    setLoadingMessage(msgs[0]);
    const interval = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMessage(msgs[i]); }, 3000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: buildPartyBrief(), selectedItems }),
      });
      clearInterval(interval);

      const bodyText = await res.text();
      let data: { plan?: unknown; brief?: unknown; error?: string } = {};
      try {
        data = JSON.parse(bodyText);
      } catch {
        throw new Error(
          isHe ? "ייצור התוכנית ארך יותר מדי. נסי שוב." : "Plan generation took too long. Please try again."
        );
      }
      if (!res.ok) throw new Error(data.error || (isHe ? "משהו השתבש" : "Something went wrong"));

      sessionStorage.setItem("bydes_plan", JSON.stringify(data));
      router.push("/plan");
    } catch (err) {
      clearInterval(interval);
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[generate]", msg);
      alert(isHe ? `שגיאה: ${msg}` : `Error: ${msg}`);
      setPhase("items");
    }
  };

  // ─── Render: generating / items phases (unchanged behaviour) ──────────────

  if (phase === "generating") return <LoadingScreen message={loadingMessage} />;

  if (phase === "items") {
    const isError = loadingMessage.includes("השתבש") || loadingMessage.includes("wrong");
    if (!categories.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-8 text-center bg-cream">
          {isError ? (
            <>
              <p className="text-charcoal font-medium">{loadingMessage}</p>
              <button
                onClick={() => { setPhase("brief"); setLoadingMessage(""); }}
                className="px-6 py-3 bg-gold text-white rounded-2xl font-medium"
              >
                {isHe ? "נסי שוב" : "Try again"}
              </button>
            </>
          ) : (
            <LoadingScreen message={loadingMessage} />
          )}
        </div>
      );
    }
    return (
      <ItemPicker
        categories={categories}
        selected={selectedItems}
        onToggle={(item) => {
          setSelectedItems((prev) =>
            prev.find((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
          );
        }}
        onGenerate={handleGenerate}
        brief={brief}
      />
    );
  }

  // ─── Render: single-page brief form ───────────────────────────────────────

  const themeChips = isHe ? THEMES_HE : THEMES_EN;
  const venueChips = isHe ? VENUE_HE : VENUE_EN;
  const styleChips = isHe ? STYLE_HE : STYLE_EN;

  const containerWidth = isDesktop ? "max-w-4xl" : "max-w-lg";

  return (
    <div className="min-h-screen bg-cream">
      <div className={`${containerWidth} mx-auto px-4 sm:px-6 py-10 pb-32`}>
        {/* Header */}
        <header className="text-center mb-8 space-y-2">
          <h1
            className="text-4xl sm:text-5xl font-heading gold-shimmer"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            By Des
          </h1>
          <p className="text-charcoal-light text-base">
            {isHe ? "כל הפרטים במקום אחד — בלי שלבים, בלי לחץ ✨" : "All the details in one place — no steps, no rush ✨"}
          </p>
        </header>

        {/* Form */}
        <div
          className={`grid gap-4 ${
            isDesktop ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* 1. Theme */}
          <FieldCard
            title={isHe ? "נושא המסיבה" : "Party theme"}
            hint={isHe ? "בחרי מהרשימה או כתבי משלך" : "Pick a chip or type your own"}
            required
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {themeChips.map((chip) => (
                <Chip key={chip} active={brief.theme === chip} onClick={() => updateBrief("theme", chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
            <TextInput
              type="text"
              value={brief.theme}
              onChange={(e) => updateBrief("theme", e.target.value)}
              placeholder={isHe ? "לדוגמה: ג'ונגל, נסיכות, יוניקורן..." : "e.g. Jungle, Princess, Unicorn..."}
            />
          </FieldCard>

          {/* 2. Kid name */}
          <FieldCard title={isHe ? "שם הילד/ה" : "Child's name"} required>
            <TextInput
              type="text"
              value={brief.kidName}
              onChange={(e) => updateBrief("kidName", e.target.value)}
              placeholder={isHe ? "השם של החוגג/ת" : "Birthday star's name"}
            />
          </FieldCard>

          {/* 3. Age */}
          <FieldCard title={isHe ? "גיל" : "Age"} required>
            <div className="flex flex-wrap gap-2 mb-3">
              {AGE_CHIPS.map((chip) => (
                <Chip key={chip} active={brief.kidAge === chip} onClick={() => updateBrief("kidAge", chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
            <TextInput
              type="number"
              min={1}
              max={18}
              value={brief.kidAge}
              onChange={(e) => updateBrief("kidAge", e.target.value)}
              placeholder={isHe ? "או הקלידי גיל אחר" : "Or type a different age"}
            />
          </FieldCard>

          {/* 4. Guests */}
          <FieldCard title={isHe ? "מספר אורחים" : "Number of guests"} required>
            <div className="flex flex-wrap gap-2 mb-3">
              {GUEST_CHIPS.map((chip) => (
                <Chip key={chip} active={brief.guests === chip} onClick={() => updateBrief("guests", chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
            <TextInput
              type="number"
              min={1}
              value={brief.guests}
              onChange={(e) => updateBrief("guests", e.target.value)}
              placeholder={isHe ? "או הקלידי מספר מדויק" : "Or type an exact number"}
            />
          </FieldCard>

          {/* 5. Budget — spans both columns on desktop so the 4 cards breathe */}
          <div className={isDesktop ? "md:col-span-2" : ""}>
            <FieldCard title={isHe ? "תקציב" : "Budget"} required>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BUDGET_OPTIONS.map((opt) => {
                  const active = brief.budget === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateBrief("budget", opt.id)}
                      className={`flex flex-col items-center gap-1 py-5 px-3 rounded-2xl border-2 transition-all duration-200
                        ${active
                          ? "border-gold bg-gold/10 scale-[1.02] shadow-md shadow-gold/20"
                          : "border-border bg-white hover:border-gold/60"
                        }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className={`font-semibold text-base ${active ? "text-gold" : "text-charcoal"}`}>
                        {isHe ? opt.he : opt.en}
                      </span>
                      <span className="text-xs text-muted-foreground">{opt.range}</span>
                    </button>
                  );
                })}
              </div>
            </FieldCard>
          </div>

          {/* 6. Venue */}
          <FieldCard
            title={isHe ? "מקום (אופציונלי)" : "Venue (optional)"}
          >
            <div className="flex flex-wrap gap-2">
              {venueChips.map((chip) => (
                <Chip
                  key={chip}
                  active={brief.venueType === chip}
                  onClick={() => updateBrief("venueType", brief.venueType === chip ? "" : chip)}
                >
                  {chip}
                </Chip>
              ))}
            </div>
          </FieldCard>

          {/* 7. Style */}
          <FieldCard
            title={isHe ? "סגנון (אופציונלי)" : "Style (optional)"}
          >
            <div className="flex flex-wrap gap-2">
              {styleChips.map((chip) => (
                <Chip
                  key={chip}
                  active={brief.stylePref === chip}
                  onClick={() => updateBrief("stylePref", brief.stylePref === chip ? "" : chip)}
                >
                  {chip}
                </Chip>
              ))}
            </div>
          </FieldCard>

          {/* 8. Free notes — spans both columns on desktop */}
          <div className={isDesktop ? "md:col-span-2" : ""}>
            <FieldCard title={isHe ? "הערות חופשיות (אופציונלי)" : "Free notes (optional)"}>
              <textarea
                value={brief.freeNotes}
                onChange={(e) => updateBrief("freeNotes", e.target.value)}
                placeholder={isHe ? "כל דבר שחשוב לדעת..." : "Anything we should know..."}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white text-charcoal
                           placeholder:text-muted-foreground focus:outline-none focus:border-gold
                           transition-colors resize-none"
              />
            </FieldCard>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button
            onClick={finishBrief}
            disabled={!canSubmit}
            className="w-full py-4 bg-gold text-white font-semibold rounded-2xl text-lg
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-gold-dark active:scale-[0.99] transition-all duration-200
                       shadow-md shadow-gold/20"
          >
            {isHe ? "צרי לי תוכנית 🎉" : "Build my plan 🎉"}
          </button>
          {!canSubmit && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              {isHe
                ? "מלאי את הנושא, השם, הגיל, מספר האורחים והתקציב כדי להמשיך"
                : "Fill theme, name, age, guests and budget to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
