"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface ElectionData {
  nom: string;
  province: string;
  total_electeurs: number;
  total_votes: number;
  users: Array<{ name: string; email: string }>;
  candidates: Array<{
    nom: string;
    partie: string;
    numero: number;
    total_votes: number;
    identifiant: string;
    a_vote: boolean;
    id_candidat: string;
  }>;
  electeurs: Array<{
    nom: string;
    identifiant: string;
    a_vote: boolean;
    id_candidat: string;
  }>;
}

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReportPage() {
  const [data, setData] = useState<ElectionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction de récupération des données
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("centres")
      .select(
        `
        nom,
        province,
        total_electeurs,
        total_votes,
        users!inner(name, email),
        candidates(nom, partie, numero, total_votes, identifiant, a_vote, id_candidat),
        electeurs(nom, identifiant, a_vote, id_candidat)
      `
      )
      .eq("users.role", "manager");

    if (!error) setData(data as ElectionData[]);
    setLoading(false);
  };

  useEffect(() => {
    // Chargement initial
    fetchData();

    // Abonnement aux changements en temps réel
    const channels = [
      supabase
        .channel("centres")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "centres" },
          () => fetchData()
        )
        .subscribe(),

      supabase
        .channel("candidates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "candidates" },
          () => fetchData()
        )
        .subscribe(),

      supabase
        .channel("electeurs")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "electeurs" },
          () => fetchData()
        )
        .subscribe(),
    ];

    // Nettoyage des abonnements
    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto p-4">
      {data.map((centre) => {
        const electors = centre.electeurs.concat(
          centre.candidates.map((candidat) => {
            return {
              nom: candidat.nom,
              identifiant: candidat.identifiant,
              a_vote: candidat.a_vote,
              id_candidat: candidat.id_candidat,
            };
          })
        );

        return (
          <section
            key={centre.nom}
            className="mb-8 p-4 border rounded-lg shadow-sm"
          >
            <header className="mb-4">
              <h2 className="text-xl font-semibold">{centre.nom}</h2>
              <p className="text-gray-600">{centre.province}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Électeurs inscrits:</span>
                  {centre.total_electeurs}
                </div>
                <div>
                  <span className="font-medium">Participation:</span>
                  {centre.total_votes} (
                  {(
                    (centre.total_votes / centre.total_electeurs) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>
            </header>

            <section className="mb-6">
              <h3 className="font-medium mb-2">Responsable du centre</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p>{centre.users[0].name}</p>
                <p className="text-gray-600">{centre.users[0].email}</p>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="font-medium mb-3">Candidats</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {centre.candidates.map((candidat) => (
                  <div key={candidat.numero} className="p-4 border rounded">
                    <div className="font-medium">{candidat.nom}</div>
                    <div className="text-sm text-gray-600">
                      {candidat.partie}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">
                        {candidat.total_votes}
                      </span>{" "}
                      votes
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-medium mb-3">Électeurs</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Nom</th>
                      <th className="p-2 text-left">Identifiant</th>
                      <th className="p-2 text-left">A voté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {electors.map((electeur) => (
                      <tr key={electeur.identifiant} className="border-b">
                        <td className="p-2">{electeur.nom}</td>
                        <td className="p-2">{electeur.identifiant}</td>
                        <td className="p-2">
                          {electeur.a_vote ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        );
      })}
    </div>
  );
}
