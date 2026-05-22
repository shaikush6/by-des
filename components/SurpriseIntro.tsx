"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SurpriseIntroProps {
  onDismiss: () => void;
}

export function SurpriseIntro({ onDismiss }: SurpriseIntroProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  const handleEnter = () => {
    setVisible(false);
    localStorage.setItem("bydes_welcomed", "true");
    setTimeout(onDismiss, 600);
  };

  if (!visible) {
    return (
      <div className="fixed inset-0 bg-charcoal z-50 animate-fade-in pointer-events-none"
           style={{ animation: "fadeIn 0.5s ease-out forwards" }} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          >
            {["🎈", "✨", "🎉", "🌟", "🎊"][i % 5]}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-sm text-center">
        {/* Logo */}
        <div className="animate-fade-in-up">
          <p className="text-gold-light text-sm tracking-[0.3em] uppercase mb-2">
            מתנה בשבילך
          </p>
          <h1
            className="text-6xl font-heading text-white leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            By Des
          </h1>
        </div>

        {/* Divider */}
        <div className="animate-fade-in-up-delay-1 flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-gold/40" />
          <span className="text-gold text-lg">✦</span>
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        {/* Personal message */}
        <div className="animate-fade-in-up-delay-2 space-y-3">
          <p className="text-gold text-lg font-medium" style={{ direction: "rtl" }}>
            {t("intro.surprise_title")}
          </p>
          <p className="text-white/70 text-sm leading-relaxed" style={{ direction: "rtl" }}>
            {/* PLACEHOLDER — Shai: replace this with your personal message */}
            הכישרון שלך אמיתי. הפרטים הקטנים שאת שמה? הם לא קטנים בכלל.
            <br /><br />
            בנינו לך את הבמה שמגיעה לך.
            <br />
            הגיע הזמן שכולם יכירו את Des.
          </p>
        </div>

        {/* CTA */}
        <div className="animate-fade-in-up-delay-3 w-full">
          <button
            onClick={handleEnter}
            className="w-full py-4 bg-gold text-white font-semibold rounded-2xl text-lg
                       hover:bg-gold-dark transition-all duration-300 active:scale-95
                       shadow-lg shadow-gold/30"
          >
            {t("intro.cta")}
          </button>
        </div>
      </div>
    </div>
  );
}
