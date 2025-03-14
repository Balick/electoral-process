"use server";

import { createClient } from "@/lib/supabase/server";

// getCandidates function to get all candidates from the candidates table
export async function getCandidates() {
  const supabase = createClient();
  const { data, error } = await supabase.from("candidates").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des candidats : `,
      error.message
    );
  }
  return data;
}

export async function getCandidate(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération du candidat ${id} : `,
      error.message
    );
  }
  return data;
}

export async function getElectors() {
  const supabase = createClient();
  const { data, error } = await supabase.from("electeurs").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des électeurs : `,
      error.message
    );
  }
  return data;
}

export async function getElector(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("electeurs")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération de l'électeur ${id} : `,
      error.message
    );
  }
  return data;
}

export async function getCentres() {
  const supabase = createClient();
  const { data, error } = await supabase.from("centres").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des centres : `,
      error.message
    );
  }
  return data;
}

export async function getCenter(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("centres")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération du centre ${id} : `,
      error.message
    );
  }
  return data;
}
