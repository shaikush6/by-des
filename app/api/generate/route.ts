import { NextRequest, NextResponse } from "next/server";
import { generatePartyPlan } from "@/lib/claude";
import { PartyBrief, PartyItem } from "@/lib/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { brief, selectedItems }: { brief: PartyBrief; selectedItems: PartyItem[] } = await req.json();

    if (!brief.theme || !brief.kidName || !brief.kidAge || !brief.guestsCount || !brief.budgetRange) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const plan = await generatePartyPlan(brief, selectedItems);
    return NextResponse.json({ plan, brief });
  } catch (err) {
    console.error("[generate]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 500 });
  }
}
