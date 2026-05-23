import { NextRequest, NextResponse } from "next/server";
import { generateItemList } from "@/lib/items";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();
    const categories = await generateItemList(brief);
    return NextResponse.json({ categories });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[items]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
