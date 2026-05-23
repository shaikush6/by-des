import Anthropic from "@anthropic-ai/sdk";
import { PartyBrief, GeneratedPlan, PartyItem } from "./types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const budgetLabels: Record<string, string> = {
  low: "חסכוני (300-600₪)",
  medium: "רגיל (600-1,200₪)",
  high: "מיוחד (1,200-2,500₪)",
  premium: "פרימיום (2,500₪+)",
};

export async function generatePartyPlan(
  brief: PartyBrief,
  selectedItems: PartyItem[]
): Promise<GeneratedPlan> {
  const isHebrew = brief.language === "he";
  const tierBasic  = isHebrew ? "בסיסי"  : "Basic";
  const tierMid    = isHebrew ? "מיוחד"  : "Special";
  const tierTop    = isHebrew ? "WOW"    : "WOW";

  const itemList = selectedItems
    .map((i) => `${i.emoji} ${i.nameHe} / ${i.nameEn}`)
    .join("\n");

  const systemPrompt = [
    "You are Des's creative AI assistant — a professional party planning expert for the Israeli market.",
    "Des is a boutique party planner known for attention to detail and creative themed parties.",
    "",
    "RULES:",
    isHebrew
      ? "1. Write ALL output content in Hebrew. Search terms in English only."
      : "1. Write ALL output content in English.",
    "2. Generate EXACTLY 3 tiers: basic, special, wow",
    "3. Use ONLY the provided selected items — do not invent new ones",
    "4. For each decor item generate specific Amazon.co.il and AliExpress search terms",
    "5. desTouchNote = one sharp creative insight per tier",
    "6. estimatedCost = realistic NIS range",
    "7. Return ONLY valid JSON — no markdown fences, no text outside the JSON object",
  ].join("\n");

  const userPrompt = [
    "Party brief:",
    `Theme: ${brief.theme}`,
    `Child: ${brief.kidName}, age ${brief.kidAge}`,
    `Guests: ${brief.guestsCount}`,
    `Budget: ${budgetLabels[brief.budgetRange] ?? brief.budgetRange}`,
    brief.venueType  ? `Venue: ${brief.venueType}`  : "",
    brief.stylePref  ? `Style: ${brief.stylePref}`  : "",
    brief.freeNotes  ? `Notes: ${brief.freeNotes}`  : "",
    "",
    "Selected items:",
    itemList,
    "",
    "Return this JSON structure (fill in all string values, keep the keys exactly):",
    JSON.stringify({
      theme: "string",
      kidName: "string",
      packages: [
        {
          tier: "basic",
          tierName: tierBasic,
          tagline: "string",
          estimatedCost: "string",
          desTouchNote: "string",
          sections: {
            decor: { items: [{ name: "string", description: "string", amazonSearchTerm: "string", aliexpressSearchTerm: "string", estimatedPrice: "string" }] },
            cake: { style: "string", description: "string", localSearchSuggestion: "string" },
            activities: [{ name: "string", description: "string", estimatedCost: "string" }],
            shopping: { localStores: ["string"], onlineLinks: ["string"] },
            designElements: [{ name: "string", description: "string", tip: "string" }],
          },
        },
        { tier: "special", tierName: tierMid, tagline: "string", estimatedCost: "string", desTouchNote: "string", sections: "same structure as basic" },
        { tier: "wow",     tierName: tierTop, tagline: "string", estimatedCost: "string", desTouchNote: "string", sections: "same structure as basic" },
      ],
    }, null, 2),
  ].filter(Boolean).join("\n");

  let step = "client_init";
  try {
    const client = getClient();

    step = "api_call";
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    step = "extract_text";
    const raw = (message.content[0] as { type: string; text: string }).text.trim();

    step = "find_json";
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error(`No JSON object found. Response starts: ${raw.slice(0, 120)}`);

    step = "parse_json";
    return JSON.parse(raw.slice(start, end + 1)) as GeneratedPlan;

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[generate][${step}]`, msg);
    throw new Error(`[${step}] ${msg}`);
  }
}
