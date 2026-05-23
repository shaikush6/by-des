import OpenAI from "openai";
import { PartyBrief } from "./types";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const budgetStyle: Record<string, string> = {
  low: "simple and cheerful, colorful and fun",
  medium: "stylish and well-coordinated, modern party aesthetic",
  high: "elegant and detailed, boutique party styling",
  premium: "luxury party styling, high-end decorations, editorial quality",
};

export async function generatePartyMoodboard(brief: PartyBrief): Promise<string | null> {
  try {
    const client = getClient();
    const style = budgetStyle[brief.budgetRange] || "stylish and fun";
    const prompt = `A stunning party moodboard for a "${brief.theme}" themed birthday party for a ${brief.kidAge} year old.
Beautiful styled flat lay: themed balloons, decorated table with matching tablecloth and centerpiece, themed cake or cupcakes, party favor bags, napkins and plates, colorful confetti.
Style: ${style}. Soft natural lighting, warm dreamy atmosphere.
${brief.genderPref === "בנות" || brief.genderPref === "Girls" ? "Feminine color palette, soft and pretty." : ""}
${brief.genderPref === "בנים" || brief.genderPref === "Boys" ? "Bold vibrant colors." : ""}
Professional party photography, overhead or 3/4 angle. No text or labels in the image.`;

    const response = await client.images.generate({
      model: "gpt-image-2-2026-04-21",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const item = response.data?.[0];
    if (!item) return null;
    if ("url" in item && item.url) return item.url;
    if ("b64_json" in item && item.b64_json) return `data:image/png;base64,${item.b64_json}`;
    return null;
  } catch (err) {
    console.error("[image generation]", err);
    return null;
  }
}
