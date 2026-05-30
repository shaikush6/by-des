"use client";

import { useState } from "react";
import { Package } from "@/lib/types";
import { ProductLink } from "./ProductLink";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Cake, Zap, ShoppingBag, Palette, ChevronDown, ChevronUp } from "lucide-react";

interface PackageCardProps {
  pkg: Package;
  isHighlighted?: boolean;
}

const tierConfig = {
  basic: {
    gradient: "from-stone-50 to-white",
    badge: "bg-stone-100 text-stone-600",
    accent: "text-stone-600",
    border: "border-stone-200",
  },
  special: {
    gradient: "from-rose-50 to-white",
    badge: "bg-rose text-charcoal",
    accent: "text-rose-700",
    border: "border-rose/40",
  },
  wow: {
    gradient: "from-amber-50 to-white",
    badge: "bg-gold text-white",
    accent: "text-gold-dark",
    border: "border-gold/40",
  },
};

function Section({
  icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium text-sm text-charcoal">
          {icon}
          {title}
        </div>
        {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-4 py-4">{children}</div>}
    </div>
  );
}

export function PackageCard({ pkg, isHighlighted = false }: PackageCardProps) {
  const { t } = useLanguage();
  const config = tierConfig[pkg.tier];

  return (
    <div
      className={`rounded-2xl border-2 ${config.border} bg-gradient-to-b ${config.gradient}
                  shadow-sm transition-all duration-300
                  ${isHighlighted ? "shadow-lg scale-[1.01] ring-2 ring-gold/30" : ""}`}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
              {pkg.tierName}
            </span>
            <p className={`mt-2 text-lg font-heading ${config.accent}`}>{pkg.tagline}</p>
          </div>
          <div className="text-end shrink-0">
            <p className="text-xs text-muted-foreground">{t("plan.estimated_cost")}</p>
            <p className="text-base font-bold text-charcoal">{pkg.estimatedCost}</p>
          </div>
        </div>

        {/* Des Touch */}
        <div className="flex gap-2 bg-gold/8 border border-gold/20 rounded-xl px-4 py-3">
          <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gold mb-0.5">{t("plan.des_touch")}</p>
            <p className="text-sm text-charcoal leading-relaxed">{pkg.desTouchNote}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 pb-5 space-y-3">
        {/* Decor */}
        {pkg.sections.decor.items.length > 0 && (
          <Section icon={<Sparkles size={14} />} title={t("plan.decor")} defaultOpen={true}>
            <ul className="space-y-4">
              {pkg.sections.decor.items.map((item, i) => (
                <li key={i} className="border-b border-border/40 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-charcoal shrink-0 bg-muted px-2 py-0.5 rounded">
                      {item.estimatedPrice}
                    </span>
                  </div>
                  <ProductLink
                    amazonSearchTerm={item.amazonSearchTerm}
                    aliexpressSearchTerm={item.aliexpressSearchTerm}
                  />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Cake */}
        <Section icon={<Cake size={14} />} title={t("plan.cake")}>
          <p className="text-sm font-medium text-charcoal">{pkg.sections.cake.style}</p>
          <p className="text-sm text-muted-foreground mt-1">{pkg.sections.cake.description}</p>
          <p className="text-xs text-charcoal-light mt-2 bg-muted/50 px-3 py-2 rounded-lg">
            🔍 {pkg.sections.cake.localSearchSuggestion}
          </p>
        </Section>

        {/* Activities */}
        {pkg.sections.activities.length > 0 && (
          <Section icon={<Zap size={14} />} title={t("plan.activities")}>
            <ul className="space-y-3">
              {pkg.sections.activities.map((act, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{act.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                  </div>
                  <span className="text-xs shrink-0 text-muted-foreground">{act.estimatedCost}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Shopping */}
        <Section icon={<ShoppingBag size={14} />} title={t("plan.shopping")}>
          {pkg.sections.shopping.localStores.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-charcoal-light mb-2">{t("plan.local_stores")}</p>
              <ul className="space-y-1">
                {pkg.sections.shopping.localStores.map((store, i) => (
                  <li key={i} className="text-sm text-charcoal">• {store}</li>
                ))}
              </ul>
            </div>
          )}
          {pkg.sections.shopping.onlineLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-charcoal-light mb-2">{t("plan.online")}</p>
              <ul className="space-y-1">
                {pkg.sections.shopping.onlineLinks.map((link, i) => (
                  <li key={i} className="text-sm text-charcoal">• {link}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Design elements */}
        {pkg.sections.designElements?.length > 0 && (
          <Section icon={<Palette size={14} />} title={t("plan.design")}>
            <ul className="space-y-3">
              {pkg.sections.designElements.map((el, i) => (
                <li key={i}>
                  <p className="text-sm font-medium text-charcoal">{el.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{el.description}</p>
                  {el.tip && (
                    <p className="text-xs text-gold-dark mt-1 italic">💡 {el.tip}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}
