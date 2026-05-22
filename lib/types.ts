export interface PartyBrief {
  theme: string;
  kidName: string;
  kidAge: number;
  guestsCount: number;
  budgetRange: "low" | "medium" | "high" | "premium";
  partyDate?: string;
  venueType?: string;
  vibeTags?: string[];
  stylePref?: string;
  genderPref?: string;
  foodNotes?: string;
  partyLanguage?: string;
  haveAlready?: string;
  freeNotes?: string;
  language: "he" | "en";
}

export interface DecorItem {
  name: string;
  description: string;
  amazonSearchTerm: string;
  aliexpressSearchTerm: string;
  estimatedPrice: string;
}

export interface CakeInfo {
  style: string;
  description: string;
  localSearchSuggestion: string;
}

export interface Activity {
  name: string;
  description: string;
  estimatedCost: string;
}

export interface DesignElement {
  name: string;
  description: string;
  tip: string;
}

export interface PackageSections {
  decor: { items: DecorItem[] };
  cake: CakeInfo;
  activities: Activity[];
  shopping: {
    localStores: string[];
    onlineLinks: string[];
  };
  designElements: DesignElement[];
}

export interface Package {
  tier: "basic" | "special" | "wow";
  tierName: string;
  tagline: string;
  estimatedCost: string;
  desTouchNote: string;
  sections: PackageSections;
}

export interface GeneratedPlan {
  theme: string;
  kidName: string;
  packages: Package[];
}

export interface SavedPlan {
  id: string;
  brief: PartyBrief;
  generatedPlan: GeneratedPlan;
  createdAt: string;
}
