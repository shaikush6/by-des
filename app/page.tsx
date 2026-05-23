"use client";

import { useEffect, useState } from "react";
import { SurpriseIntro } from "@/components/SurpriseIntro";
import { Journey } from "@/components/Journey";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function HomePage() {
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

      {/* Language toggle — floats over the journey */}
      <div className="fixed top-4 end-4 z-30">
        <LanguageToggle />
      </div>

      <Journey />
    </>
  );
}
