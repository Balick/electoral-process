"use server";

import { createClient } from "@/lib/supabase/server";
import { getCandidates, getElectors } from "./candidate";

// Fonction getVoterById pour obtenir un électeur ou un candidat par identifiant
// Paramètre : id (string) est l'identifiant de l'électeur ou du candidat
export async function getVoterById(id: string) {
  const supabase = createClient();

  // Premièrement, tenter de récupérer l'électeur dans la table 'electeurs'
  const { data: electeurData, error: electeurError } = await supabase
    .from("electeurs")
    .select("*")
    .eq("identifiant", id);

  if (electeurError) {
    console.error(
      "Erreur lors de la récupération de l'électeur :",
      electeurError.message
    );
    return [];
  }

  if (electeurData && electeurData.length > 0) {
    // Électeur trouvé dans la table 'electeurs'
    return electeurData;
  } else {
    // Aucun électeur trouvé, vérifier dans la table 'candidates'
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("identifiant", id);

    if (candidateError) {
      console.error(
        "Erreur lors de la récupération du candidat :",
        candidateError.message
      );
      return [];
    }

    if (candidateData && candidateData.length > 0) {
      // Candidat trouvé dans la table 'candidates'
      return candidateData;
    } else {
      // Aucun enregistrement trouvé dans les deux tables
      return [];
    }
  }
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

// Fonction de vote pour mettre à jour un vote
export async function vote(
  id_candidate: string,
  id_centre: string,
  id_elector: string
) {
  const supabase = createClient();

  // Déterminer si le votant est un électeur ou un candidat
  let tableVotant: string;
  const { data: elector, error: electeurError } = await supabase
    .from("electeurs")
    .select("*")
    .eq("id", id_elector)
    .maybeSingle();

  if (electeurError) {
    console.error("❌ Erreur vérification électeur :", electeurError.message);
    return false;
  }

  if (elector) {
    tableVotant = "electeurs";
  } else {
    const { data: candidate, error: candidatError } = await supabase
      .from("candidates")
      .select("id")
      .eq("id", id_elector)
      .maybeSingle();

    if (candidatError) {
      console.error("❌ Erreur vérification candidat :", candidatError.message);
      return false;
    }

    if (candidate) {
      tableVotant = "candidates";
    } else {
      console.error("❌ Votant non trouvé dans electeurs ou candidates");
      return false;
    }
  }

  // Mettre à jour le statut de vote du votant
  const { error: erreurVotant } = await supabase
    .from(tableVotant)
    .update({
      a_vote: true,
      id_candidat: id_candidate,
      date_vote: new Date().toISOString(),
    })
    .eq("id", id_elector);

  if (erreurVotant) {
    console.error("❌ Erreur mise à jour votant :", erreurVotant.message);
    return false;
  }

  // Récupérer le total_votes du centre
  const { data: dataCentre, error: erreurCentre } = await supabase
    .from("centres")
    .select("total_votes")
    .eq("id", id_centre)
    .single();

  if (erreurCentre) {
    console.error("❌ Erreur récupération centre : ", erreurCentre.message);
    return false;
  }

  // Mettre à jour le total_votes du centre
  const { error: erreurMajCentre } = await supabase
    .from("centres")
    .update({ total_votes: dataCentre.total_votes + 1 })
    .eq("id", id_centre);

  if (erreurMajCentre) {
    console.error("❌ Erreur mise à jour centre : ", erreurMajCentre.message);
    return false;
  }

  // Récupérer le total_votes du candidat
  const { data: dataCandidat, error: erreurCandidat } = await supabase
    .from("candidates")
    .select("total_votes")
    .eq("id", id_candidate)
    .single();

  if (erreurCandidat) {
    console.error("❌ Erreur récupération candidat : ", erreurCandidat.message);
    return false;
  }

  // Mettre à jour le total_votes du candidat
  const { error: erreurMajCandidat } = await supabase
    .from("candidates")
    .update({ total_votes: dataCandidat.total_votes + 1 })
    .eq("id", id_candidate);

  if (erreurMajCandidat) {
    console.error(
      "❌ Erreur mise à jour votes candidat : ",
      erreurMajCandidat.message
    );
    return false;
  }

  console.log("✨ Vote enregistré avec succès");
  return true;
}

export async function similateVoteProcess() {
  const operations = [0, 1]; // 0 : blank vote, 1 : vote
  const electors = await getElectors();
  const candidates = await getCandidates();
  let electorsWithCandidates = [];
  let finalElectorsData: {
    id: any;
    identifiant: any;
    id_centre: any;
    a_vote: any;
    date_vote: any;
    id_candidat: any;
    nom: any;
  }[] = [];

  if (!electors && !candidates) {
    console.error("Aucun électeur ou candidat trouvé");
    return;
  } else if (electors && candidates) {
    electorsWithCandidates = Array.from(candidates).concat(
      Array.from(electors)
    );
    finalElectorsData = electorsWithCandidates.map((elector) => {
      return {
        id: elector.id,
        identifiant: elector.identifiant,
        id_centre: elector.id_centre,
        a_vote: elector.a_vote,
        date_vote: elector.date_vote,
        id_candidat: elector.id_candidat,
        nom: elector.nom,
      };
    });
  }

  if (!candidates) return;
  const idCandidateList = candidates.map((elector) => elector.id_candidat);

  for (const elector of finalElectorsData) {
    const id_centre = elector.id_centre;
    const id_elector = elector.id;
    const id_candidat =
      idCandidateList[Math.floor(Math.random() * idCandidateList.length)];
    const operation = Math.floor(Math.random() * operations.length);

    if (operation === 0) {
      await blankVote(id_elector);
    } else {
      await vote(id_candidat, id_centre, id_elector);
    }
  }
}

/*export async function changeVotersCenter() {
  const supabase = createClient();
  const centers = await getCenters();
  const electors = await getElectors();
  const candidates = await getCandidates();

  if (!electors && !candidates) {
    console.log(
      "Aucun électeur ni candidat trouvé. Aucune modification effectuée."
    );
    return;
  }

  const idCentersList = centers.map((center) => center.id);
  const centerCounts = {}; // Objet pour stocker le nombre d'électeurs/candidats par centre

  // Mise à jour des électeurs
  if (electors) {
    for (const elector of electors) {
      const idCentre =
        idCentersList[Math.floor(Math.random() * idCentersList.length)];
      const { error } = await supabase
        .from("electeurs")
        .update({ id_centre: idCentre })
        .eq("id", elector.id);
      if (error) {
        console.error(
          "Erreur lors de la mise à jour de l'électeur :",
          elector.id,
          error.message
        );
        continue; // Continuer même en cas d'erreur pour les autres électeurs
      }
      centerCounts[idCentre] = (centerCounts[idCentre] || 0) + 1;
    }
  }

  // Mise à jour des candidats
  if (candidates) {
    for (const candidate of candidates) {
      const idCentre =
        idCentersList[Math.floor(Math.random() * idCentersList.length)];
      const { error } = await supabase
        .from("candidates")
        .update({ id_centre: idCentre })
        .eq("id", candidate.id);
      if (error) {
        console.error(
          "Erreur lors de la mise à jour du candidat :",
          candidate.id,
          error.message
        );
        continue; // Continuer même en cas d'erreur pour les autres candidats
      }
      centerCounts[idCentre] = (centerCounts[idCentre] || 0) + 1;
    }
  }

  // Mise à jour du total_electeurs pour chaque centre
  for (const idCentre in centerCounts) {
    const count = centerCounts[idCentre];
    const { data: centreData, error: errorCentre } = await supabase
      .from("centres")
      .select("total_electeurs")
      .eq("id", idCentre)
      .single();

    if (errorCentre) {
      console.error("❌ Erreur récupération centre : ", errorCentre.message);
      continue;
    }

    const currentTotalElecteurs = centreData?.total_electeurs || 0;
    const newTotalElecteurs = currentTotalElecteurs + count;

    const { error: errorMajTotalElecteurs } = await supabase
      .from("centres")
      .update({ total_electeurs: newTotalElecteurs })
      .eq("id", idCentre);

    if (errorMajTotalElecteurs) {
      console.error(
        "❌ Erreur mise à jour centre : ",
        errorMajTotalElecteurs.message
      );
    }
  }

  return true;
}
*/
