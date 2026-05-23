"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ItemCategory, PartyItem } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Info } from "lucide-react";

interface ItemPickerProps {
  categories: ItemCategory[];
  selected: PartyItem[];
  onToggle: (item: PartyItem) => void;
  onGenerate: () => void;
  brief: { theme: string; kidName: string };
}

function ItemTile({
  item, isSelected, onToggle, onInfo,
}: {
  item: PartyItem; isSelected: boolean; onToggle: () => void; onInfo: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <button
        onClick={onToggle}
        className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-2
                    border-2 transition-all duration-200 active:scale-95
          ${isSelected
            ? "border-gold bg-gold/10 shadow-sm shadow-gold/20"
            : "border-border bg-white hover:border-gold/40"
          }`}
      >
        <span className="text-3xl leading-none">{item.emoji}</span>
        <span className={`text-xs font-medium text-center leading-tight line-clamp-2 ${isSelected ? "text-gold-dark" : "text-charcoal"}`}>
          {item.nameHe}
        </span>
        {isSelected && (
          <div className="absolute top-1.5 end-1.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
            <Check size={9} className="text-white" strokeWidth={3} />
          </div>
        )}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onInfo(); }}
        className="absolute top-1.5 start-1.5 w-4 h-4 flex items-center justify-center opacity-30 hover:opacity-70"
      >
        <Info size={11} className="text-charcoal" />
      </button>
    </motion.div>
  );
}

function InfoSheet({ item, onClose }: { item: PartyItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="bg-white rounded-t-3xl p-6 w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{item.emoji}</span>
          <div>
            <h3 className="font-semibold text-charcoal text-lg">{item.nameHe}</h3>
            <p className="text-sm text-muted-foreground">{item.nameEn}</p>
          </div>
        </div>
        <p className="text-sm text-charcoal-light leading-relaxed">{item.description}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gold text-white rounded-xl font-medium"
        >
          סגרי
        </button>
      </motion.div>
    </motion.div>
  );
}

export function ItemPicker({ categories, selected, onToggle, onGenerate, brief }: ItemPickerProps) {
  const { lang } = useLanguage();
  const isHe = lang === "he";
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const [infoItem, setInfoItem] = useState<PartyItem | null>(null);

  const currentCategory = categories.find((c) => c.id === activeCategory);
  const selectedIds = new Set(selected.map((i) => i.id));

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h2 className="font-heading text-xl text-charcoal mb-1">
            {isHe ? `בנה את המסיבה של ${brief.kidName}` : `Build ${brief.kidName}'s Party`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isHe ? `נושא: ${brief.theme} • ` : `Theme: ${brief.theme} • `}
            {selected.length} {isHe ? "פריטים נבחרו" : "items selected"}
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-[73px] z-20 bg-cream/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-lg mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 py-2 min-w-max">
            {categories.map((cat) => {
              const catSelected = cat.items.filter((i) => selectedIds.has(i.id)).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                              whitespace-nowrap transition-all duration-200
                    ${activeCategory === cat.id
                      ? "bg-gold text-white shadow-sm"
                      : "bg-white text-charcoal-light border border-border hover:border-gold/50"
                    }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.nameHe}</span>
                  {catSelected > 0 && (
                    <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold
                      ${activeCategory === cat.id ? "bg-white/30 text-white" : "bg-gold/15 text-gold-dark"}`}>
                      {catSelected}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Item grid */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-32">
        <AnimatePresence mode="wait">
          {currentCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-3 sm:grid-cols-4"
            >
              {currentCategory.items.map((item) => (
                <ItemTile
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggle={() => onToggle(item)}
                  onInfo={() => setInfoItem(item)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-cream/95 backdrop-blur-sm border-t border-border/50 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onGenerate}
            disabled={selected.length === 0}
            className="w-full py-4 bg-gold text-white font-semibold rounded-2xl text-lg
                       disabled:opacity-40 hover:bg-gold-dark active:scale-[0.98]
                       transition-all duration-200 shadow-md shadow-gold/20"
          >
            {isHe ? `תיצרי לי תוכנית עם ${selected.length} פריטים 🎉` : `Build my plan with ${selected.length} items 🎉`}
          </button>
        </div>
      </div>

      {/* Info sheet */}
      <AnimatePresence>
        {infoItem && <InfoSheet item={infoItem} onClose={() => setInfoItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
