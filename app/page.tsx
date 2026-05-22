"use client";

import { useEffect, useState } from "react";
import { SurpriseIntro } from "@/components/SurpriseIntro";
import { PartyForm } from "@/components/PartyForm";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  const [showIntro, setShowIntro] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    const welcomed = localStorage.getItem("bydes_welcomed");
    setShowIntro(!welcomed);
    setIntroChecked(true);
  }, []);

  if (!introChecked) return null;

  return (
    <>
      {showIntro && <SurpriseIntro onDismiss={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-cream">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <h1
              className="text-2xl font-heading text-charcoal gold-shimmer"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              By Des
            </h1>
            <LanguageToggle />
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-lg mx-auto px-4 pt-8 pb-4 text-center">
          <p className="text-charcoal-light text-base">{t("app.tagline")}</p>
        </div>

        {/* Form */}
        <main className="max-w-lg mx-auto px-4 pb-16">
          <div className="bg-white/60 rounded-3xl border border-border shadow-sm p-5">
            <h2 className="font-heading text-2xl text-charcoal mb-1">{t("form.heading")}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t("form.subheading")}</p>
            <PartyForm />
          </div>
        </main>
      </div>
    </>
  );
}
