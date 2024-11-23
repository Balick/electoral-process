"use server";

import { createClient } from "@/lib/supabase/server";

// getVoterById function to get a voter by id
// params: id (string) is the id of the voter
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

// blankVote function to update a blank vote
// a blank vote is a vote where the candidate is not selected
export async function blankVote(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("electeurs")
    // update the a_vote and date_vote columns to true and the current date
    .update({ a_vote: true, date_vote: new Date().toISOString() })
    .eq("identifiant", id);

  if (error) {
    console.error("Error while updating blank vote: ", error.message);
    return false;
  }
  // success message
  console.log("✨  Successfully updated blank vote");
}

// vote function to update a vote
export async function vote(
  id_candidate: string,
  id_centre: string,
  id_elector: string,
) {
  const supabase = createClient();
  // get the total_votes column from the centers table
  const { data: dataCenter, error: errorCenter } = await supabase
    .from("centres")
    .select("total_votes")
    .single();

  if (errorCenter) {
    console.error("❌  Error fetching center: ", errorCenter.message);
    return false;
  }

  // update the a_vote, id_candidat, and date_vote
  // for elector who has voted
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

  // update the total_votes column for the center
  const { error: errorUpdateCenter } = await supabase
    .from("centres")
    .update({ total_votes: dataCenter.total_votes + 1 })
    .eq("id", id_centre);

  if (errorUpdateCenter) {
    console.error(
      "❌  Error while updating center: ",
      errorUpdateCenter.message,
    );
    return false;
  }

  // get the total_votes column for the candidate
  const { data: dataCandidate, error: errorUpdateCandidate } = await supabase
    .from("candidates")
    .select("total_votes")
    .eq("id", id_candidate)
    .single();

  if (errorUpdateCandidate) {
    console.error(
      "❌  Error fetching candidate: ",
      errorUpdateCandidate.message,
    );
    return false;
  }

  // update the total_votes column for the candidate
  const { error: errorUpdateCandidateVotes } = await supabase
    .from("candidates")
    .update({ total_votes: dataCandidate.total_votes + 1 })
    .eq("id", id_candidate);

  if (errorUpdateCandidateVotes) {
    console.error(
      "❌  Error updating candidate votes: ",
      errorUpdateCandidateVotes.message,
    );
    return false;
  }

  console.log("✨  Successfully voted");
}
