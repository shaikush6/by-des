"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeneratedPlan, PartyBrief } from "@/lib/types";
import { PackageCard } from "@/components/PackageCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";

interface PlanSession {
  plan: GeneratedPlan;
  brief: PartyBrief;
}

export default function PlanPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<PlanSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bydes_plan");
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch { /* ignore */ }
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

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1
            className="text-2xl font-heading gold-shimmer"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            By Des
          </h1>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-20 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-3xl text-charcoal">{plan.theme}</h2>
          <p className="text-muted-foreground text-sm">
            {t("plan.for")} {plan.kidName} · {brief.guestsCount} {t("plan.guests")}
          </p>
        </div>

        <div className="flex items-center justify-start">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-charcoal transition-colors"
          >
            <ArrowRight size={14} />
            {t("plan.new_plan")}
          </button>
        </div>

        <div className="space-y-4">
          {plan.packages.map((pkg) => (
            <PackageCard
              key={pkg.tier}
              pkg={pkg}
              isHighlighted={pkg.tier === "special"}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
