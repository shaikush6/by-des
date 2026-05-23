import { NextRequest, NextResponse } from "next/server";
import { generatePartyMoodboard } from "@/lib/openai-image";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();
    const imageUrl = await generatePartyMoodboard(brief);
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("[image]", err instanceof Error ? err.message : err);
    return NextResponse.json({ imageUrl: null });
  }
}
