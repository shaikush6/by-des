import Anthropic from "@anthropic-ai/sdk";
import { ItemCategory, PartyBrief } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateItemList(brief: PartyBrief): Promise<ItemCategory[]> {
  const prompt = `Party planner: list items for a "${brief.theme}" birthday party, age ${brief.kidAge}, ${brief.guestsCount} guests, ${brief.budgetRange} budget.

Return ONLY a JSON array. No markdown. No explanation. Use this structure exactly:
[{"id":"decor","emoji":"🎈","nameHe":"קישוטים","nameEn":"Decorations","items":[{"id":"balloons","emoji":"🎈","nameHe":"בלונים","nameEn":"Balloons","category":"decor","description":"theme balloons","defaultSelected":true}]}]

Category IDs (use all 6): decor, cake, favors, tableware, activities, design
4-6 items per category. Items must be specific to "${brief.theme}" theme.
defaultSelected:true for essentials, false for extras.`;

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
