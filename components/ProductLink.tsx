"use client";

import { ExternalLink } from "lucide-react";
import { amazonLink, aliexpressLink } from "@/lib/links";
import { useLanguage } from "@/context/LanguageContext";

interface ProductLinkProps {
  amazonSearchTerm: string;
  aliexpressSearchTerm: string;
}

export function ProductLink({ amazonSearchTerm, aliexpressSearchTerm }: ProductLinkProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      <a
        href={amazonLink(amazonSearchTerm)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                   bg-[#FF9900]/10 text-[#B06000] border border-[#FF9900]/30
                   hover:bg-[#FF9900]/20 transition-colors duration-200"
      >
        <ExternalLink size={11} />
        {t("plan.amazon")}
      </a>
      <a
        href={aliexpressLink(aliexpressSearchTerm)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                   bg-[#E62E04]/10 text-[#E62E04] border border-[#E62E04]/30
                   hover:bg-[#E62E04]/20 transition-colors duration-200"
      >
        <ExternalLink size={11} />
        {t("plan.aliexpress")}
      </a>
    </div>
  );
}
