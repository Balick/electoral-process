"use client";

import { createClient } from "@supabase/supabase-js";
import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import LoadingSkeleton from "./LaodingSkeleton";

Chart.register(...registerables);

interface ElectionResult {
  candidate_id: string;
  candidate_name: string;
  partie: string;
  numero: number;
  province: string;
  province_votes: number;
  total_votes: number;
  national_percentage: number;
}

interface ProvinceResult {
  province: string;
  total_votes: number;
  leading_candidate: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResultsPage() {
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [provinceResults, setProvinceResults] = useState<ProvinceResult[]>([]);
  const [loading, setLoading] = useState(true);

  const processData = (data: any[]) => {
    const provinceResultsMap = new Map<string, ProvinceResult>();
    const candidatesMap = new Map<string, ElectionResult>();

    data.forEach((item) => {
      // Agrégation par province
      const provinceKey = item.province;
      const currentProvince = provinceResultsMap.get(provinceKey) || {
        province: provinceKey,
        total_votes: 0,
        leading_candidate: "",
        max_votes: 0,
      };

      currentProvince.total_votes += item.total_votes; // Utiliser total_votes
      if (item.total_votes > currentProvince.max_votes) {
        currentProvince.leading_candidate = item.candidate_name;
        currentProvince.max_votes = item.total_votes;
      }
      provinceResultsMap.set(provinceKey, currentProvince);

      // Agrégation par candidat
      const candidateKey = item.candidate_id;
      const currentCandidate = candidatesMap.get(candidateKey) || {
        ...item,
        national_percentage: 0,
      };
      currentCandidate.total_votes = item.total_votes; // Pas de somme cumulative
      candidatesMap.set(candidateKey, currentCandidate);
    });

    // Calcul du pourcentage national
    const totalNational = Array.from(candidatesMap.values()).reduce(
      (acc, curr) => acc + curr.total_votes,
      0
    );

    candidatesMap.forEach((candidate) => {
      candidate.national_percentage =
        (candidate.total_votes / totalNational) * 100;
    });

    setProvinceResults(Array.from(provinceResultsMap.values()));
    setResults(Array.from(candidatesMap.values()));
    setLoading(false);
  };

  const fetchResults = async () => {
    const { data, error } = await supabase.from("candidates").select(`
        id,
        nom,
        partie,
        numero,
        total_votes,
        centres!inner(province)
      `); // Retirer la jointure avec electeurs

    if (error) {
      console.error("Erreur de récupération:", error);
      setLoading(false);
      return;
    }

    if (data) {
      const processedData = data.map((candidate) => ({
        candidate_id: candidate.id,
        candidate_name: candidate.nom,
        partie: candidate.partie,
        numero: candidate.numero,
        province: candidate.centres?.province || "Inconnue",
        total_votes: candidate.total_votes, // Utiliser directement total_votes
        province_votes: candidate.total_votes, // Même valeur pour la province
      }));

      processData(processedData);
    }
  };

  useEffect(() => {
    fetchResults();

    const subscription = supabase
      .channel("real-time-results")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidates" },
        () => fetchResults()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        await fetchResults();
      } catch (error) {
        if (isMounted) {
          console.error("Erreur fatale:", error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSkeleton />;

  // Préparation des données pour les graphiques
  const candidatesData = {
    labels: results.map((r) => r.candidate_name),
    datasets: [
      {
        label: "Votes Nationaux",
        data: results.map((r) => r.total_votes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const provincesData = {
    labels: provinceResults.map((p) => p.province),
    datasets: [
      {
        label: "Votes par Province",
        data: provinceResults.map((p) => p.total_votes),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Résultats des Élections
      </h1>

      {/* Section des résultats nationaux */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Résultats Nationaux</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Bar
              data={candidatesData}
              options={{ responsive: true, indexAxis: "y" }}
            />
          </div>
          <div className="space-y-4">
            {results
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.candidate_id === v.candidate_id) === i
              )
              .sort((a, b) => b.total_votes - a.total_votes)
              .map((candidate) => {
                return (
                  <div
                    key={candidate.candidate_id}
                    className="p-4 border rounded"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          #{candidate.numero} {candidate.candidate_name}
                        </h3>
                        <p className="text-gray-600">{candidate.partie}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {candidate.total_votes}
                        </p>
                        <p className="text-gray-600">
                          {isNaN(candidate.national_percentage)
                            ? 0
                            : candidate.national_percentage.toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Section des résultats par province */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Résultats par Province</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Bar data={provincesData} options={{ responsive: true }} />
          </div>
          <div className="space-y-4">
            {provinceResults
              .sort((a, b) => b.total_votes - a.total_votes)
              .map((province) => (
                <div key={province.province} className="p-4 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{province.province}</h3>
                      <p className="text-gray-600">
                        Leader: {province.leading_candidate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {province.total_votes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Tableau détaillé des résultats */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Détails par Candidat et Province
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Candidat</th>
                <th className="p-3 text-left">Province</th>
                <th className="p-3 text-left">Parti</th>
                <th className="p-3 text-right">Votes</th>
                <th className="p-3 text-right">% National</th>
              </tr>
            </thead>
            <tbody>
              {results
                .sort((a, b) => b.total_votes - a.total_votes)
                .map((result, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{result.candidate_name}</td>
                    <td className="p-3">{result.province}</td>
                    <td className="p-3">{result.partie}</td>
                    <td className="p-3 text-right">
                      {result.province_votes.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      {isNaN(result.national_percentage)
                        ? 0
                        : result.national_percentage.toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
