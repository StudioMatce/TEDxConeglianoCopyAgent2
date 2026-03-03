import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { MODEL_ID } from "@/lib/ai/provider";

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ id: null });
  }

  const body = await req.json();

  try {
    const { data, error } = await supabase
      .from("generations")
      .insert({
        topic: body.topic,
        platform: body.platform,
        style_params: body.styleParams,
        edition_theme_active: body.editionThemeActive ?? false,
        output_options: body.outputOptions,
        generated_copy: body.generatedCopy,
        model: MODEL_ID,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ id: null });
    }

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json({ id: null });
  }
}
