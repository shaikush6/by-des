"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useView } from "@/context/ViewContext";

export function ViewToggle() {
  const { view, toggle, isNarrow } = useView();

  // On actual mobile screens the toggle is meaningless — hide it.
  if (isNarrow) return null;

  const isDesktop = view === "desktop";
  const Icon = isDesktop ? Monitor : Smartphone;
  const label = isDesktop ? "Mobile view" : "Desktop view";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full
                 border border-gold/40 text-charcoal-light bg-white/60
                 hover:border-gold hover:text-gold transition-colors duration-200"
    >
      <Icon size={16} />
    </button>
  );
}
