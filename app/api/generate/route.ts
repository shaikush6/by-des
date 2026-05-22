import { NextRequest, NextResponse } from "next/server";
import { generatePartyPlan } from "@/lib/claude";
import { supabase } from "@/lib/supabase";
import { PartyBrief } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const brief: PartyBrief = await req.json();

    if (!brief.theme || !brief.kidName || !brief.kidAge || !brief.guestsCount || !brief.budgetRange) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const generatedPlan = await generatePartyPlan(brief);

    const { data, error } = await supabase
      .from("plans")
      .insert({
        theme: brief.theme,
        kid_name: brief.kidName,
        kid_age: brief.kidAge,
        guests_count: brief.guestsCount,
        budget_range: brief.budgetRange,
        vibe_tags: brief.vibeTags ?? [],
        venue_type: brief.venueType ?? null,
        party_date: brief.partyDate ?? null,
        style_pref: brief.stylePref ?? null,
        food_notes: brief.foodNotes ?? null,
        free_notes: brief.freeNotes ?? null,
        generated_plan: generatedPlan,
        language: brief.language,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[generate]", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
