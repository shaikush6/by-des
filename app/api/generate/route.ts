import { NextRequest, NextResponse } from "next/server";
import { generatePartyPlan } from "@/lib/claude";
import { generatePartyMoodboard } from "@/lib/openai-image";
import { PartyBrief, PartyItem } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { brief, selectedItems }: { brief: PartyBrief; selectedItems: PartyItem[] } = await req.json();

    if (!brief.theme || !brief.kidName || !brief.kidAge || !brief.guestsCount || !brief.budgetRange) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Run plan generation + image generation in parallel
    const [plan, imageUrl] = await Promise.all([
      generatePartyPlan(brief, selectedItems),
      generatePartyMoodboard(brief),
    ]);

    return NextResponse.json({ plan, imageUrl, brief });
  } catch (err) {
    console.error("[generate]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 500 });
  }
}
