"use server";

import { createClient } from "@/lib/supabase/server";

// getCandidates function to get all candidates from the candidates table
export async function getCandidates() {
  const supabase = createClient();
  const { data, error } = await supabase.from("candidates").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des candidats : `,
      error.message,
    );
  }
  return data;
}
