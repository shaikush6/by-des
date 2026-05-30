"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeneratedPlan, PartyBrief } from "@/lib/types";
import { PackageCard } from "@/components/PackageCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ViewToggle } from "@/components/ViewToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useView } from "@/context/ViewContext";
import { ArrowRight } from "lucide-react";

interface PlanSession {
  plan: GeneratedPlan;
  brief: PartyBrief;
}

type Tier = "basic" | "special" | "wow";

export default function PlanPage() {
  const { t } = useLanguage();
  const { effective } = useView();
  const router = useRouter();
  const [session, setSession] = useState<PlanSession | null>(null);
  const [ready, setReady] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [activeTier, setActiveTier] = useState<Tier>("special");

  const isDesktop = effective === "desktop";
  const containerWidth = isDesktop ? "max-w-4xl" : "max-w-lg";

  useEffect(() => {
    const raw = sessionStorage.getItem("bydes_plan");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.brief),
        })
          .then((r) => r.json())
          .then((data) => setImageUrl(data.imageUrl ?? null))
          .catch(() => setImageUrl(null))
          .finally(() => setImageLoading(false));
      } catch {
        setImageLoading(false);
      }
    } else {
      setImageLoading(false);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-charcoal font-medium">לא מצאנו תוכנית — נסי שוב</p>
        <button onClick={() => router.push("/")} className="text-gold underline text-sm">
          חזרי לדף הבית
        </button>
      </div>
    );
  }

  const { plan, brief } = session;
  const activePkg = plan.packages.find((p) => p.tier === activeTier) ?? plan.packages[0];

  const tierColors: Record<Tier, string> = {
    basic:   "border-stone-300 text-stone-600 bg-stone-50",
    special: "border-rose/60 text-rose-700 bg-rose-50",
    wow:     "border-gold/60 text-gold-dark bg-amber-50",
  };
  const tierActiveColors: Record<Tier, string> = {
    basic:   "border-stone-400 bg-stone-100 text-stone-800 font-semibold",
    special: "border-rose text-rose-800 bg-rose/20 font-semibold",
    wow:     "border-gold bg-gold/20 text-gold-dark font-semibold",
  };

  const TierTabs = (
    <div className="flex gap-2 justify-center">
      {plan.packages.map((pkg) => (
        <button
          key={pkg.tier}
          onClick={() => setActiveTier(pkg.tier as Tier)}
          className={`flex-1 border-2 rounded-xl px-3 py-2.5 text-sm transition-all
            ${activeTier === pkg.tier
              ? tierActiveColors[pkg.tier as Tier]
              : `${tierColors[pkg.tier as Tier]} opacity-60 hover:opacity-90`
            }`}
        >
          <div className="font-medium">{pkg.tierName}</div>
          <div className="text-xs opacity-70 mt-0.5">{pkg.estimatedCost}</div>
        </button>
      ))}
    </div>
  );

  const Moodboard = (
    <div className="rounded-3xl overflow-hidden shadow-lg shadow-charcoal/10 bg-muted aspect-square">
      {imageLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-light to-gold-light/30">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-3 border-gold/30" />
            <div className="absolute inset-0 rounded-full border-3 border-gold border-t-transparent animate-spin" style={{ borderWidth: 3 }} />
          </div>
          <p className="text-sm text-charcoal-light">יוצרת את המוד בורד שלך...</p>
        </div>
      ) : imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={`${plan.theme} moodboard`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-light to-gold-light/30">
          <p className="text-4xl">🎉</p>
        </div>
      )}
    </div>
  );

  const PlanHeader = (
    <div className="space-y-2">
      <div className="text-center space-y-1">
        <h2 className="font-heading text-3xl text-charcoal">{plan.theme}</h2>
        <p className="text-muted-foreground text-sm">
          {t("plan.for")} {plan.kidName} · {brief.guestsCount} {t("plan.guests")}
        </p>
      </div>
      <div className="text-center">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-charcoal transition-colors"
        >
          <ArrowRight size={14} />
          {t("plan.new_plan")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-border/50">
        <div className={`${containerWidth} mx-auto px-4 py-3 flex items-center justify-between`}>
          <h1 className="text-2xl font-heading gold-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
            By Des
          </h1>
          <div className="flex items-center gap-2">
            <ViewToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className={`${containerWidth} mx-auto px-4 py-6 pb-20`}>
        {isDesktop ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-5 md:sticky md:top-20">
              {Moodboard}
              {PlanHeader}
              {TierTabs}
            </div>
            <div>
              <PackageCard key={activeTier} pkg={activePkg} isHighlighted={activeTier === "special"} />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {Moodboard}
            {PlanHeader}
            {TierTabs}
            <PackageCard key={activeTier} pkg={activePkg} isHighlighted={activeTier === "special"} />
          </div>
        )}
      </main>
    </div>
  );
}
