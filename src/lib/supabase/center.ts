"use server";

import { Center } from "@/app/admin/dashboard/centres/_components/columns";
import { User } from "@/constants";
import { createClient } from "@/lib/supabase/server";

// getCenters function to get all centers from the centers table
export async function getCenters(): Promise<Center[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("centres").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des centres : `,
      error.message
    );
  }

  return data as Center[];
}

// getCenter function to get a center from the centers table
export async function getCenter(id: string): Promise<Center | null> {
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

  return data?.[0] as Center;
}

// getCenterByName function to get a center from the centers table
export async function getCenterByName(name: string): Promise<Center | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("centres")
    .select("*")
    .eq("nom", name);

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération du centre ${name} : `,
      error.message
    );
  }

  return data?.[0] as Center;
}

// getManager function to get a manager from the users table
export async function getManager(id_center: string) {
  const supabase = createClient();

  const { data, error: errorUser } = await supabase
    .from("users")
    .select("*")
    .eq("center_id", id_center);

  if (errorUser) {
    console.error(
      `❌   Erreur lors de la récupération du manager du centre ${id_center} : `,
      errorUser.message
    );
  }

  return data;
}

export async function getUser(id_user: string): Promise<User | null> {
  const supabase = createClient();

  const { data, error: errorUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", id_user)
    .single();

  if (errorUser) {
    console.error(
      `❌   Erreur lors de la récupération de l'utilisateur ${id_user} : `,
      errorUser.message
    );
  }

  return data;
}

export async function getManagers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "manager");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des managers : `,
      error.message
    );
  }

  return data;
}

export async function getUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error(
      `❌   Erreur lors de la récupération des managers : `,
      error.message
    );
  }

  return data;
}

export async function updateManager(id: string, data: any) {
  const supabase = createClient();
  const { data: updatedData, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error(
      `❌   Erreur lors de la mise à jour du manager ${id} : `,
      error.message
    );
  }

  return updatedData;
}
