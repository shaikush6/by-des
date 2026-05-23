import Anthropic from "@anthropic-ai/sdk";
import { ItemCategory, PartyBrief } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateItemList(brief: PartyBrief): Promise<ItemCategory[]> {
  const prompt = `You are a party planner. Generate items for a "${brief.theme}" birthday party (age ${brief.kidAge}, ${brief.budgetRange} budget).

Return ONLY a valid JSON array — no markdown, no text before or after.
Use exactly these 5 category IDs: decor, cake, favors, tableware, activities
Exactly 4 items per category. All items must be themed to "${brief.theme}".
defaultSelected: true for must-haves, false for nice-to-haves.

Example format (replace with real theme-specific items):
[
  {"id":"decor","emoji":"🎈","nameHe":"קישוטים","nameEn":"Decorations","items":[
    {"id":"d1","emoji":"🎈","nameHe":"בלונים","nameEn":"Balloons","defaultSelected":true},
    {"id":"d2","emoji":"🎀","nameHe":"באנר","nameEn":"Banner","defaultSelected":true},
    {"id":"d3","emoji":"✨","nameHe":"קונפטי","nameEn":"Confetti","defaultSelected":false},
    {"id":"d4","emoji":"🌿","nameHe":"מרכז שולחן","nameEn":"Centerpiece","defaultSelected":true}
  ]},
  {"id":"cake","emoji":"🎂","nameHe":"עוגה","nameEn":"Cake","items":[...]},
  {"id":"favors","emoji":"🎁","nameHe":"מטח","nameEn":"Favors","items":[...]},
  {"id":"tableware","emoji":"🍽️","nameHe":"כלי שולחן","nameEn":"Tableware","items":[...]},
  {"id":"activities","emoji":"🎮","nameHe":"פעילויות","nameEn":"Activities","items":[...]}
]`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (msg.content[0] as { type: string; text: string }).text.trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error(`No JSON array found in response: ${text.slice(0, 200)}`);
  return JSON.parse(text.slice(start, end + 1)) as ItemCategory[];
}
