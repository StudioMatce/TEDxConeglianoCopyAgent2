import { supabase } from "@/lib/supabase/client";
import type { Generation, Platform } from "@/types";

export async function getTopExamples(
  platform: Platform,
  limit: number = 3
): Promise<Generation[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("platform", platform)
      .gte("rating", 4)
      .order("rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data as Generation[]) ?? [];
  } catch {
    return [];
  }
}
