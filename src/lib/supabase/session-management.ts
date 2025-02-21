"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkSession() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("duree")
    .select("end_session")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Erreur lors de la vérification de la session :", error);
    return;
  }

  if (data?.end_session) {
    redirect("/center?sessionEnd=true");
  }
}

// updateEndTime function to update the end time
// params: endTime (string) is the new end time
export async function updateEndTime(endTime: string) {
  const supabase = createClient();

  // verify if during is existing in database
  const { data, error: errorExisting } = await supabase.from("duree").select();

  if (errorExisting) {
    console.error("Error while selecting end time");
    return;
  }

  // if the end time does not exist, insert it
  if (data?.length === 0) {
    // insert the end time
    const { error } = await supabase.from("duree").insert({ fin: endTime });

    if (error) {
      console.error("Error while inserting end time: ", error.message);
      return false;
    }

    console.log("✨  Successfully inserted end time");
    return true;
  }

  // update the end time and end_session column
  const { error } = await supabase
    .from("duree")
    .update({ fin: endTime, end_session: false })
    .eq("id", data[0].id);

  if (error) {
    console.error("Error while updating end time: ", error.message);
    return false;
  }

  console.log("✨  Successfully updated end time", endTime);
  return true;
}

// updateEndSession function to update the end session
// params: id (any) is the id of the session
export async function updateEndSession(id: any) {
  const supabase = createClient();

  const { error } = await supabase
    .from("duree")
    .update({ end_session: true })
    .eq("id", id);

  if (error) {
    console.error(`❌  Erreur de mise à jour de la durée`, error.message);
  }
  console.log(`✅  Mise à jour de la durée réussie`);
}

// resetSession function to reset the session
// it resets the end time and end_session column
export async function resetSession() {
  const supabase = createClient();
  // get the end time and end_session column
  const { data, error } = await supabase.from("duree").select("*").single();

  if (error) {
    console.error("Error fetching end time: ", error.message);
    return;
  }

  // if the end_session column is true, update it to false
  if (data.end_session) {
    const { error } = await supabase
      .from("duree")
      .update({ end_session: false });

    if (error) {
      console.error("Error updating end session: ", error.message);
      return;
    }

    console.log("✨  Successfully updated end session");
  }

  console.log("End session : ", data.end_session);
}

export async function getTime() {
  const supabase = createClient();

  const { data, error } = await supabase.from("duree").select("fin").single();

  if (error) {
    console.error("Error while selecting end time : ", error.message);
    return;
  }

  return data.fin;
}

export async function getEndSession() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("duree")
    .select("fin_session")
    .single();

  if (error) {
    console.error("Error while selecting end time : ", error.message);
    return;
  }

  return data.fin_session;
}
