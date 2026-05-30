import OpenAI from "openai";
import { ItemCategory, PartyBrief } from "./types";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateItemList(brief: PartyBrief): Promise<ItemCategory[]> {
  const prompt = `You are a party planner. Generate items for a "${brief.theme}" birthday party (age ${brief.kidAge}, ${brief.budgetRange} budget).

Return a JSON object with a single key "categories" containing an array.
Use exactly these 5 category IDs: decor, cake, favors, tableware, activities
Exactly 4 items per category. All items must be themed to "${brief.theme}".
defaultSelected: true for must-haves, false for nice-to-haves.

Format:
{"categories":[
  {"id":"decor","emoji":"🎈","nameHe":"קישוטים","nameEn":"Decorations","items":[
    {"id":"d1","emoji":"🎈","nameHe":"בלונים","nameEn":"Balloons","defaultSelected":true},
    {"id":"d2","emoji":"🎀","nameHe":"באנר","nameEn":"Banner","defaultSelected":true},
    {"id":"d3","emoji":"✨","nameHe":"קונפטי","nameEn":"Confetti","defaultSelected":false},
    {"id":"d4","emoji":"🌿","nameHe":"מרכז שולחן","nameEn":"Centerpiece","defaultSelected":true}
  ]},
  {"id":"cake","emoji":"🎂","nameHe":"עוגה","nameEn":"Cake","items":[...]},
  {"id":"favors","emoji":"🎁","nameHe":"מתנות","nameEn":"Favors","items":[...]},
  {"id":"tableware","emoji":"🍽️","nameHe":"כלי שולחן","nameEn":"Tableware","items":[...]},
  {"id":"activities","emoji":"🎮","nameHe":"פעילויות","nameEn":"Activities","items":[...]}
]}`;

  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    max_tokens: 3000,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const data = JSON.parse(response.choices[0].message.content ?? "{}");
  const categories = data.categories ?? data;
  if (!Array.isArray(categories)) throw new Error("Expected array of categories");
  return categories as ItemCategory[];
}
