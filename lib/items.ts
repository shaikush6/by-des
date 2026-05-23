import Anthropic from "@anthropic-ai/sdk";
import { ItemCategory, PartyBrief } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateItemList(brief: PartyBrief): Promise<ItemCategory[]> {
  const prompt = `You are a professional party planner. Generate a comprehensive list of ALL items needed for this party:
Theme: "${brief.theme}", Age: ${brief.kidAge}, Guests: ${brief.guestsCount}, Budget: ${brief.budgetRange}

Return ONLY valid JSON — no markdown, no explanation — matching this exact structure:
[
  {
    "id": "decor",
    "emoji": "🎈",
    "nameHe": "קישוטים",
    "nameEn": "Decorations",
    "items": [
      {
        "id": "balloons",
        "emoji": "🎈",
        "nameHe": "בלונים",
        "nameEn": "Balloons",
        "category": "decor",
        "description": "Theme-colored balloons, mix of regular and foil",
        "defaultSelected": true
      }
    ]
  }
]

Use these exact category IDs: decor, cake, favors, tableware, activities, design, photo, extras

Rules:
- Generate 5-8 items per category, all theme-specific to "${brief.theme}"
- defaultSelected: true for essential items, false for optional/premium ones
- Emojis must be highly relevant to each specific item
- nameHe must be natural Hebrew
- description is English, detailed enough for generating product search terms later
- Include items across ALL 8 categories`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (msg.content[0] as { type: string; text: string }).text.trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Invalid item list response");
  return JSON.parse(text.slice(start, end + 1)) as ItemCategory[];
}
