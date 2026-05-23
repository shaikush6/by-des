import { NextRequest, NextResponse } from "next/server";
import { generateItemList } from "@/lib/items";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();
    const categories = await generateItemList(brief);
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[items]", err);
    return NextResponse.json({ error: "Failed to generate items" }, { status: 500 });
  }
}
