"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ShareButton() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                 border-2 border-gold text-gold font-medium text-sm
                 hover:bg-gold hover:text-white transition-all duration-200 active:scale-95"
    >
      {copied ? (
        <>
          <Check size={15} />
          {t("plan.share_copied")}
        </>
      ) : (
        <>
          <Share2 size={15} />
          {t("plan.share")}
        </>
      )}
    </button>
  );
}
