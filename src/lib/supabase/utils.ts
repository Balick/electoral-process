"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";

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

export async function blankVote(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("electeurs")
    .update({ a_vote: true, date_vote: new Date().toISOString() })
    .eq("identifiant", id);

  if (error) {
    console.error("Error while updating blank vote: ", error.message);
    return false;
  }

  console.log("✨  Successfully updated blank vote");
}

export async function vote(
  id_candidate: string,
  id_centre: string,
  id_elector: string
) {
  const supabase = createClient();

  const { data: dataCenter, error: errorCenter } = await supabase
    .from("centres")
    .select("total_votes")
    .single();

  if (errorCenter) {
    console.error("❌  Error fetching center: ", errorCenter.message);
    return false;
  }

  const { error: errorVoter } = await supabase
    .from("electeurs")
    .update({
      a_vote: true,
      id_candidat: id_candidate,
      date_vote: new Date().toISOString(),
    })
    .eq("id", id_elector);

  if (errorVoter) {
    console.error("❌  Error while voting: ", errorVoter.message);
    return false;
  }

  const { error: errorUpdateCenter } = await supabase
    .from("centres")
    .update({ total_votes: dataCenter.total_votes + 1 })
    .eq("id", id_centre);

  if (errorUpdateCenter) {
    console.error(
      "❌  Error while updating center: ",
      errorUpdateCenter.message
    );
    return false;
  }

  const { data: dataCandidate, error: errorUpdateCandidate } = await supabase
    .from("candidates")
    .select("total_votes")
    .eq("id", id_candidate)
    .single();

  if (errorUpdateCandidate) {
    console.error(
      "❌  Error fetching candidate: ",
      errorUpdateCandidate.message
    );
    return false;
  }

  const { error: errorUpdateCandidateVotes } = await supabase
    .from("candidates")
    .update({ total_votes: dataCandidate.total_votes + 1 })
    .eq("id", id_candidate);

  if (errorUpdateCandidateVotes) {
    console.error(
      "❌  Error updating candidate votes: ",
      errorUpdateCandidateVotes.message
    );
    return false;
  }

  console.log("✨  Successfully voted");
}

export async function getVoterById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("electeurs")
    .select("*")
    .eq("identifiant", id);

  if (error) {
    console.error("Error fetching voter: ", error.message);
    return [];
  }

  return data;
}

export async function connectManager() {
  const supabase = createClient();

  const { data: UserAuth, error } = await supabase.auth.getUser();
  if (error || !UserAuth?.user) {
    redirect("/center/signin");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", UserAuth.user.email)
    .single();

  if (user.role !== "manager") {
    await signOut().then(() => redirect("/center/signin"));
  }

  return user;
}

export async function connectAdmin() {
  const supabase = createClient();

  const { data: UserAuth, error } = await supabase.auth.getUser();
  if (error || !UserAuth?.user) {
    redirect("/admin/signin");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", UserAuth.user.email)
    .single();

  if (user.role !== "admin") {
    await signOut().then(() => redirect("/admin/signin"));
  }

  return user;
}

export async function updateEndTime(endTime: string) {
  console.log("End Time : ", endTime);
  const supabase = createClient();

  // vérify if during is exists in database
  const { data, error: errorExisting } = await supabase.from("duree").select();

  if (errorExisting) {
    console.error("Error while selecting end time");
    return;
  }

  if (data?.length === 0) {
    const { error } = await supabase.from("duree").insert({ fin: endTime });

    if (error) {
      console.error("Error while inserting end time: ", error.message);
      return false;
    }

    console.log("✨  Successfully inserted end time");
    return true;
  }

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

export async function resetSession() {
  const supabase = createClient();
  const { data, error } = await supabase.from("duree").select("*").single();

  if (error) {
    console.error("Error fetching end time: ", error.message);
    return;
  }

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
