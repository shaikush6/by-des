import { NextRequest, NextResponse } from "next/server";
import { generatePartyPlan } from "@/lib/claude";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();

    if (!brief.theme || !brief.kidName || !brief.kidAge || !brief.guestsCount || !brief.budgetRange) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const generatedPlan = await generatePartyPlan(brief);

    return NextResponse.json({ plan: generatedPlan, brief });
  } catch (err) {
    console.error("[generate]", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
