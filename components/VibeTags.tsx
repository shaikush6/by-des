"use client";

import { useLanguage } from "@/context/LanguageContext";

interface VibeTagsProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  optionsKey: string;
  max?: number;
}

export function VibeTags({ selected, onChange, optionsKey, max = 5 }: VibeTagsProps) {
  const { t } = useLanguage();
  const options = t(optionsKey) as unknown as string[];
  const tags = Array.isArray(options) ? options : [];

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((s) => s !== tag));
    } else if (selected.length < max) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
            ${
              selected.includes(tag)
                ? "bg-rose text-charcoal border-rose shadow-sm"
                : "bg-white text-charcoal-light border-border hover:border-rose hover:text-charcoal"
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
