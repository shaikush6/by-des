import Anthropic from "@anthropic-ai/sdk";
import { PartyBrief, GeneratedPlan } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const budgetLabels: Record<string, string> = {
  low: "חסכוני (300-600₪) / Budget (₪300-600)",
  medium: "רגיל (600-1,200₪) / Standard (₪600-1,200)",
  high: "מיוחד (1,200-2,500₪) / Special (₪1,200-2,500)",
  premium: "פרימיום (2,500₪+) / Premium (₪2,500+)",
};

export async function generatePartyPlan(brief: PartyBrief): Promise<GeneratedPlan> {
  const isHebrew = brief.language === "he";

  const systemPrompt = `You are Des's creative AI assistant — a professional party planning expert specializing in the Israeli market.
Des is a boutique party planner known for her incredible attention to detail, creative themes, and beautiful execution.
She turns ordinary birthdays into unforgettable experiences.

Your job: Given a party brief, generate 3 complete party package tiers as structured JSON.

CRITICAL RULES:
1. ${isHebrew ? "Write ALL content in Hebrew (names, descriptions, tips, taglines). Only product search terms can be in English." : "Write ALL content in English. Product search terms in English."}
2. Generate EXACTLY 3 tiers: basic, special, wow
3. Product search terms must be SPECIFIC enough to surface real results on amazon.co.il and AliExpress Israel
4. The "desTouchNote" per package is the creative insight that makes this tier special — Des's signature. Make it sharp, surprising, and genuinely helpful.
5. localStores should be generic search suggestions (e.g. "חנות פרטי מסיבה", "כלבו") not specific store names
6. estimatedCost should be a realistic ₪ range for the Israeli market
7. All decor items should be realistic products you can actually find online
8. Return ONLY valid JSON — no markdown, no explanation, just the JSON object`;

  const userPrompt = `Party Brief:
- Theme: ${brief.theme}
- Child: ${brief.kidName}, age ${brief.kidAge}
- Guests: ${brief.guestsCount}
- Budget: ${budgetLabels[brief.budgetRange]}
${brief.partyDate ? `- Date: ${brief.partyDate}` : ""}
${brief.venueType ? `- Venue: ${brief.venueType}` : ""}
${brief.vibeTags?.length ? `- Vibe: ${brief.vibeTags.join(", ")}` : ""}
${brief.stylePref ? `- Style: ${brief.stylePref}` : ""}
${brief.genderPref ? `- Color/Gender preference: ${brief.genderPref}` : ""}
${brief.foodNotes ? `- Food notes: ${brief.foodNotes}` : ""}
${brief.partyLanguage ? `- Party language: ${brief.partyLanguage}` : ""}
${brief.haveAlready ? `- Already have: ${brief.haveAlready}` : ""}
${brief.freeNotes ? `- Notes: ${brief.freeNotes}` : ""}

Generate 3 complete party packages. Return this exact JSON structure:
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
          "items": [
            {
              "name": string,
              "description": string,
              "amazonSearchTerm": string,
              "aliexpressSearchTerm": string,
              "estimatedPrice": string
            }
          ]
        },
        "cake": {
          "style": string,
          "description": string,
          "localSearchSuggestion": string
        },
        "activities": [
          {
            "name": string,
            "description": string,
            "estimatedCost": string
          }
        ],
        "shopping": {
          "localStores": [string],
          "onlineLinks": [string]
        },
        "designElements": [
          {
            "name": string,
            "description": string,
            "tip": string
          }
        ]
      }
    },
    { "tier": "special", "tierName": "${isHebrew ? "מיוחד" : "Special"}", ... },
    { "tier": "wow", "tierName": "${isHebrew ? "WOW ✨" : "WOW ✨"}", ... }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const text = content.text.trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found in response");

  return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as GeneratedPlan;
}
