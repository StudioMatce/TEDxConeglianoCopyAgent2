import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ ok: false });
  }

  const { generationId, rating, correction } = await req.json();

  try {
    const { error } = await supabase
      .from("generations")
      .update({
        rating,
        correction: correction || null,
      })
      .eq("id", generationId);

    if (error) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
