"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GeneratedPlan } from "@/lib/types";
import { PackageCard } from "@/components/PackageCard";
import { ShareButton } from "@/components/ShareButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";

interface PlanData {
  id: string;
  theme: string;
  kid_name: string;
  guests_count: number;
  generated_plan: GeneratedPlan;
  language: "he" | "en";
}

export default function PlanPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/plans/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPlan(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🎉</div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-charcoal font-medium">לא מצאנו את התוכנית הזאת</p>
        <button onClick={() => router.push("/")} className="text-gold underline text-sm">
          חזרי לדף הבית
        </button>
      </div>
    );
  }

  const { generated_plan: gp } = plan;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
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
        {/* Plan header */}
        <div className="text-center space-y-1">
          <h2 className="font-heading text-3xl text-charcoal">
            {gp.theme}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("plan.for")} {gp.kidName} · {plan.guests_count} {t("plan.guests")}
          </p>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-charcoal transition-colors"
          >
            <ArrowRight size={14} />
            {t("plan.new_plan")}
          </button>
          <ShareButton />
        </div>

        {/* Tier tabs / package cards */}
        <div className="space-y-4">
          {gp.packages.map((pkg, i) => (
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
