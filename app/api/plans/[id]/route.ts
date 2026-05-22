import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("plans")
      .select("id, theme, kid_name, guests_count, generated_plan, language, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[plans/id]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
