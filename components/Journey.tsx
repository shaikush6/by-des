"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { PartyBrief, ItemCategory, PartyItem } from "@/lib/types";
import { ItemPicker } from "./ItemPicker";
import { ChevronRight, ChevronLeft } from "lucide-react";

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

// ─── Step slide animation ─────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const transition = { type: "tween" as const, duration: 0.32 };

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current ? "w-5 h-2 bg-gold" : "w-2 h-2 bg-gold/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Step shell ───────────────────────────────────────────────────────────────

function StepShell({
  step,
  total,
  onBack,
  question,
  subtext,
  children,
  canContinue,
  onContinue,
  continueLabel,
  skipLabel,
  onSkip,
}: {
  step: number;
  total: number;
  onBack?: () => void;
  question: string;
  subtext?: string;
  children: React.ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const { lang } = useLanguage();
  const isRtl = lang === "he";

  return (
    <div className="flex flex-col min-h-screen bg-cream px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {onBack ? (
          <button onClick={onBack} className="p-2 -m-2 text-charcoal-light hover:text-charcoal">
            {isRtl ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        ) : <div />}
        <ProgressDots total={total} current={step} />
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl text-charcoal leading-tight">{question}</h2>
          {subtext && <p className="text-muted-foreground text-base">{subtext}</p>}
        </div>
        <div>{children}</div>
      </div>

      {/* Bottom */}
      <div className="max-w-md mx-auto w-full space-y-3 pt-6">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full py-4 bg-gold text-white font-semibold rounded-2xl text-lg
                     disabled:opacity-35 disabled:cursor-not-allowed
                     hover:bg-gold-dark active:scale-[0.98] transition-all duration-200
                     shadow-md shadow-gold/20"
        >
          {continueLabel ?? (isRtl ? "המשיכי ←" : "Continue →")}
        </button>
        {skipLabel && onSkip && (
          <button onClick={onSkip} className="w-full text-sm text-muted-foreground py-2">
            {skipLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 1: Theme ────────────────────────────────────────────────────────────

const THEMES_HE = ["ים", "ג'ונגל", "נסיכות", "Unicorn", "חלל", "דינוזאורים", "Retro 90s", "ספארי", "קרקס", "אמנות", "כדורגל", "בועות"];
const THEMES_EN = ["Beach", "Jungle", "Princess", "Unicorn", "Space", "Dinosaurs", "Retro 90s", "Safari", "Circus", "Art", "Football", "Bubbles"];

function Step1Theme({ value, onChange, lang }: { value: string; onChange: (v: string) => void; lang: string }) {
  const chips = lang === "he" ? THEMES_HE : THEMES_EN;
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={lang === "he" ? "לדוגמה: ג׳ונגל, נסיכות, Unicorn..." : "e.g. Jungle, Princess, Unicorn..."}
        className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-white text-charcoal text-lg
                   placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
        autoFocus
      />
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
              ${value === chip
                ? "bg-gold text-white border-gold shadow-sm"
                : "bg-white text-charcoal border-border hover:border-gold hover:text-gold"
              }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Kid ──────────────────────────────────────────────────────────────

function Step2Kid({
  name, age, onName, onAge, lang,
}: { name: string; age: string; onName: (v: string) => void; onAge: (v: string) => void; lang: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder={lang === "he" ? "שם" : "Name"}
          className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-white text-charcoal text-lg
                     placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
          autoFocus
        />
      </div>
      <div>
        <input
          type="number"
          value={age}
          onChange={(e) => onAge(e.target.value)}
          placeholder={lang === "he" ? "גיל" : "Age"}
          min="1"
          max="18"
          className="w-full px-4 py-4 rounded-2xl border-2 border-border bg-white text-charcoal text-lg text-center
                     placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
        />
      </div>
    </div>
  );
}

// ─── Step 3: Guests ───────────────────────────────────────────────────────────

function Step3Guests({ value, onChange, lang }: { value: string; onChange: (v: string) => void; lang: string }) {
  const n = parseInt(value) || 0;
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={() => onChange(String(Math.max(1, n - 5)))}
        className="w-14 h-14 rounded-full border-2 border-border bg-white text-2xl font-light
                   hover:border-gold hover:text-gold active:scale-95 transition-all"
      >
        −
      </button>
      <div className="text-center min-w-[80px]">
        <span className="font-heading text-5xl text-charcoal">{n || "?"}</span>
        <p className="text-xs text-muted-foreground mt-1">{lang === "he" ? "אורחים" : "guests"}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(String(n + 5))}
        className="w-14 h-14 rounded-full border-2 border-border bg-white text-2xl font-light
                   hover:border-gold hover:text-gold active:scale-95 transition-all"
      >
        +
      </button>
    </div>
  );
}

// ─── Step 4: Budget ───────────────────────────────────────────────────────────

const BUDGET_OPTIONS = [
  { id: "low", emoji: "💛", he: "חסכוני", en: "Budget", range: "₪300-600" },
  { id: "medium", emoji: "✨", he: "רגיל", en: "Standard", range: "₪600-1,200" },
  { id: "high", emoji: "🌟", he: "מיוחד", en: "Special", range: "₪1,200-2,500" },
  { id: "premium", emoji: "👑", he: "פרימיום", en: "Premium", range: "₪2,500+" },
];

function Step4Budget({ value, onChange, onAutoAdvance, lang }: {
  value: BudgetRange | ""; onChange: (v: BudgetRange) => void; onAutoAdvance: () => void; lang: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BUDGET_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => { onChange(opt.id as BudgetRange); setTimeout(onAutoAdvance, 220); }}
          className={`flex flex-col items-center gap-1 py-5 px-3 rounded-2xl border-2 transition-all duration-200
            ${value === opt.id
              ? "border-gold bg-gold/10 scale-[1.03] shadow-md shadow-gold/20"
              : "border-border bg-white hover:border-gold/60"
            }`}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <span className={`font-semibold text-base ${value === opt.id ? "text-gold" : "text-charcoal"}`}>
            {lang === "he" ? opt.he : opt.en}
          </span>
          <span className="text-xs text-muted-foreground">{opt.range}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Step 5: Optional ─────────────────────────────────────────────────────────

const VENUE_HE = ["בית", "אולם", "גינה", "חוף ים", "פארק"];
const VENUE_EN = ["Home", "Event Hall", "Garden", "Beach", "Park"];
const STYLE_HE = ["אלגנטי", "צבעוני", "מינימליסטי", "בוהו", "ילדותי"];
const STYLE_EN = ["Elegant", "Colorful", "Minimalist", "Boho", "Playful"];
const GENDER_HE = ["בנות 💗", "בנים 💙", "ניטרלי 💛"];
const GENDER_EN = ["Girls 💗", "Boys 💙", "Neutral 💛"];

function ChipRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
            ${value === opt ? "bg-charcoal text-white border-charcoal" : "bg-white text-charcoal-light border-border hover:border-charcoal/40"}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Step5Optional({ state, update, lang }: {
  state: BriefState; update: (k: keyof BriefState, v: string) => void; lang: string;
}) {
  const isHe = lang === "he";
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-charcoal-light mb-2">{isHe ? "מקום" : "Venue"}</p>
        <ChipRow options={isHe ? VENUE_HE : VENUE_EN} value={state.venueType} onChange={(v) => update("venueType", v)} />
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal-light mb-2">{isHe ? "סגנון" : "Style"}</p>
        <ChipRow options={isHe ? STYLE_HE : STYLE_EN} value={state.stylePref} onChange={(v) => update("stylePref", v)} />
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal-light mb-2">{isHe ? "מגדר / צבעים" : "Gender / Colors"}</p>
        <ChipRow options={isHe ? GENDER_HE : GENDER_EN} value={state.genderPref} onChange={(v) => update("genderPref", v)} />
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal-light mb-2">{isHe ? "הערות" : "Notes"}</p>
        <textarea
          value={state.freeNotes}
          onChange={(e) => update("freeNotes", e.target.value)}
          placeholder={isHe ? "כל דבר שחשוב לדעת..." : "Anything we should know..."}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
        />
      </div>
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
  const router = useRouter();
  const isHe = lang === "he";

  const [phase, setPhase] = useState<Phase>("brief");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [brief, setBrief] = useState<BriefState>({
    theme: "", kidName: "", kidAge: "", guests: "",
    budget: "", venueType: "", vibeTags: [], stylePref: "", genderPref: "", freeNotes: "",
  });
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [selectedItems, setSelectedItems] = useState<PartyItem[]>([]);

  const updateBrief = useCallback((k: keyof BriefState, v: string) => {
    setBrief((b) => ({ ...b, [k]: v }));
  }, []);

  const goTo = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const canContinue = [
    !!brief.theme.trim(),
    !!brief.kidName.trim() && !!brief.kidAge,
    parseInt(brief.guests) > 0,
    !!brief.budget,
    true, // optional step always passable
  ][step] ?? true;

  // After completing brief, load items
  const finishBrief = async () => {
    setLoadingMessage(isHe ? "Des מנתחת את המסיבה שלך..." : "Des is analyzing your party...");
    setPhase("items");

    const partyBrief: PartyBrief = {
      theme: brief.theme, kidName: brief.kidName,
      kidAge: parseInt(brief.kidAge), guestsCount: parseInt(brief.guests),
      budgetRange: brief.budget as PartyBrief["budgetRange"], language: lang,
      ...(brief.venueType && { venueType: brief.venueType }),
      ...(brief.stylePref && { stylePref: brief.stylePref }),
      ...(brief.genderPref && { genderPref: brief.genderPref }),
      ...(brief.freeNotes && { freeNotes: brief.freeNotes }),
    };

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partyBrief),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const cats: ItemCategory[] = data.categories;
      setCategories(cats);
      // Pre-select default items
      const defaults = cats.flatMap((c) => c.items.filter((i) => i.defaultSelected));
      setSelectedItems(defaults);
    } catch (err) {
      console.error(err);
      setLoadingMessage(isHe ? "משהו השתבש, נסי שוב" : "Something went wrong, please try again");
    }
  };

  const handleNext = () => {
    if (step < 4) {
      goTo(step + 1);
    } else {
      finishBrief();
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

    const partyBrief: PartyBrief = {
      theme: brief.theme, kidName: brief.kidName,
      kidAge: parseInt(brief.kidAge), guestsCount: parseInt(brief.guests),
      budgetRange: brief.budget as PartyBrief["budgetRange"], language: lang,
      ...(brief.venueType && { venueType: brief.venueType }),
      ...(brief.stylePref && { stylePref: brief.stylePref }),
      ...(brief.genderPref && { genderPref: brief.genderPref }),
      ...(brief.freeNotes && { freeNotes: brief.freeNotes }),
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: partyBrief, selectedItems }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("bydes_plan", JSON.stringify(data));
      router.push("/plan");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setPhase("items");
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (phase === "generating") return <LoadingScreen message={loadingMessage} />;

  if (phase === "items") {
    if (!categories.length) return <LoadingScreen message={loadingMessage} />;
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

  const STEPS_HE = [
    { q: "מה הנושא?", sub: "הכל מתחיל מהחלום ✨" },
    { q: "מי החוגג/ת?", sub: "ספרי לנו על כוכב/ת המסיבה" },
    { q: "כמה חברים מגיעים?", sub: "כל ילד שווה מסיבה 🎉" },
    { q: "מה התקציב?", sub: "נתאים את הקסם לתקציב" },
    { q: "רוצה להוסיף עוד?", sub: "אפשר לדלג — יש לנו מה שצריך" },
  ];
  const STEPS_EN = [
    { q: "What's the theme?", sub: "Every great party starts with a dream ✨" },
    { q: "Who's the birthday star?", sub: "Tell us about the guest of honor" },
    { q: "How many guests?", sub: "The more the merrier 🎉" },
    { q: "What's the budget?", sub: "We'll tailor the magic to fit" },
    { q: "Want to add more details?", sub: "Feel free to skip — we have what we need" },
  ];
  const steps = isHe ? STEPS_HE : STEPS_EN;

  return (
    <div className="relative overflow-hidden min-h-screen">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
        >
          <StepShell
            step={step}
            total={5}
            onBack={step > 0 ? () => goTo(step - 1) : undefined}
            question={steps[step].q}
            subtext={steps[step].sub}
            canContinue={canContinue}
            onContinue={handleNext}
            continueLabel={step === 4 ? (isHe ? "בואו נבנה! 🎉" : "Let's build! 🎉") : undefined}
            skipLabel={step === 4 ? (isHe ? "דלגי על הפרטים הנוספים" : "Skip extra details") : undefined}
            onSkip={step === 4 ? finishBrief : undefined}
          >
            {step === 0 && <Step1Theme value={brief.theme} onChange={(v) => updateBrief("theme", v)} lang={lang} />}
            {step === 1 && <Step2Kid name={brief.kidName} age={brief.kidAge} onName={(v) => updateBrief("kidName", v)} onAge={(v) => updateBrief("kidAge", v)} lang={lang} />}
            {step === 2 && <Step3Guests value={brief.guests} onChange={(v) => updateBrief("guests", v)} lang={lang} />}
            {step === 3 && <Step4Budget value={brief.budget} onChange={(v) => updateBrief("budget", v as BudgetRange)} onAutoAdvance={handleNext} lang={lang} />}
            {step === 4 && <Step5Optional state={brief} update={updateBrief} lang={lang} />}
          </StepShell>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
