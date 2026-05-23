import Anthropic from "@anthropic-ai/sdk";
import { PartyBrief, GeneratedPlan, PartyItem } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  const itemList = selectedItems.map((i) => `${i.emoji} ${i.nameHe} (${i.description})`).join("\n");

  const systemPrompt = `You are Des's creative AI assistant — a professional party planning expert for the Israeli market.
Des is a boutique party planner known for attention to detail and creative themed parties.

CRITICAL RULES:
1. ${isHebrew ? "Write ALL content in Hebrew. Only search terms in English." : "Write ALL content in English."}
2. Generate EXACTLY 3 tiers: basic, special, wow
3. ONLY include items from the provided selected items list — do not add new items
4. For each item, generate specific Amazon.co.il and AliExpress search terms
5. desTouchNote = one sharp creative insight per tier — Des's signature touch
6. estimatedCost = realistic ₪ range for Israeli market
7. Return ONLY valid JSON`;

  const userPrompt = `Party Brief:
- Theme: ${brief.theme}
- Child: ${brief.kidName}, age ${brief.kidAge}
- Guests: ${brief.guestsCount}
- Budget: ${budgetLabels[brief.budgetRange]}
${brief.venueType ? `- Venue: ${brief.venueType}` : ""}
${brief.stylePref ? `- Style: ${brief.stylePref}` : ""}
${brief.freeNotes ? `- Notes: ${brief.freeNotes}` : ""}

Selected items to include:
${itemList}

Generate 3 package tiers. Each tier uses all selected items but at different quality/quantity levels.
Return this exact JSON:
{
  "theme": string,
  "kidName": string,
  "packages": [
    {
      "tier": "basic",
      "tierName": "${isHebrew ? "בסיסי" : "Basic"}",
      "tagline": string,
      "estimatedCost": string,
      "desTouchNote": string,
      "sections": {
        "decor": {
          "items": [{ "name": string, "description": string, "amazonSearchTerm": string, "aliexpressSearchTerm": string, "estimatedPrice": string }]
        },
        "cake": { "style": string, "description": string, "localSearchSuggestion": string },
        "activities": [{ "name": string, "description": string, "estimatedCost": string }],
        "shopping": { "localStores": [string], "onlineLinks": [string] },
        "designElements": [{ "name": string, "description": string, "tip": string }]
      }
    },
    { "tier": "special", "tierName": "${isHebrew ? "מיוחד" : "Special"}", ... },
    { "tier": "wow", "tierName": "${isHebrew ? "WOW ✨" : "WOW ✨"}", ... }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 5000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in response");
  return JSON.parse(text.slice(start, end + 1)) as GeneratedPlan;
}
