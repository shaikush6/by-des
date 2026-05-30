import { NextRequest, NextResponse } from "next/server";
import { generatePartyMoodboard } from "@/lib/openai-image";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();
    const imageUrl = await generatePartyMoodboard(brief);
    return NextResponse.json({ imageUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[image]", msg);
    return NextResponse.json({ imageUrl: null, _debug: msg });
  }
}
