"use client";

import Timer from "@/app/admin/dashboard/_components/timer";
import DateTime from "@/components/date-time";
import { images } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Définition de types pour les données des candidats
type Candidate = {
  id: number;
  name: string;
  total_votes: number;
  numero: number;
};

export default function SuccessPage() {
  const supabase = createClient();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  useEffect(() => {
    // Fonction pour récupérer les candidats
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase.from("candidates").select("*");

        if (error) {
          console.error(
            "Erreur lors de la récupération des candidats :",
            error
          );
          return;
        }

        if (data) {
          setCandidates(data);
          const total = data.reduce(
            (acc, candidate) => acc + candidate.total_votes,
            0
          );
          setTotalVotes(total);
        }
      } catch (error) {
        console.error(
          "Erreur inattendue lors de la récupération des candidats :",
          error
        );
      }
    };

    // Fonction pour vérifier l'état de la session
    const fetchSessionStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("duree")
          .select("end_session")
          .single();

        if (error) {
          console.error(
            "Erreur lors de la récupération de l'état de la session :",
            error
          );
          return;
        }

        if (data) {
          setIsSessionEnded(data.end_session);
        }
      } catch (error) {
        console.error(
          "Erreur inattendue lors de la récupération de la session :",
          error
        );
      }
    };

    // Appel initial des données
    fetchCandidates();
    fetchSessionStatus();

    // Souscription aux changements des candidats
    const candidatesSubscription = supabase
      .channel("public:candidates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidates" },
        () => {
          fetchCandidates();
        }
      )
      .subscribe();

    // Souscription aux changements de la session
    const sessionSubscription = supabase
      .channel("public:duree")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "duree" },
        () => {
          fetchSessionStatus();
        }
      )
      .subscribe();

    // Nettoyage des souscriptions lors du démontage du composant
    return () => {
      supabase.removeChannel(candidatesSubscription);
      supabase.removeChannel(sessionSubscription);
    };
  }, [supabase]);

  return (
    <>
      <header className="px-8 py-4 fixed inset-x-0 top-0 z-10">
        <nav>
          <ul className="flex items-center justify-between font-semibold uppercase">
            <li>
              <h1 className="text-2xl font-bold">CENI</h1>
            </li>
            <li>
              <DateTime />
            </li>
          </ul>
        </nav>
      </header>

      <main className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col lg:flex-row items-center pt-20 px-8 bg-gray-100">
        <section className="lg:w-[30%] flex-none flex flex-col items-center justify-center gap-2">
          <Clock
            className={cn("w-16 h-16", !isSessionEnded && "animate-spin-slow")}
          />
          <p className="font-semibold text-lg uppercase flex flex-col items-center">
            Il reste <Timer />
          </p>
          <Link href="/result/details" className="underline">
            Voir les résultats détaillés
          </Link>
        </section>

        <section className="space-y-4 w-full">
          <h2 className="uppercase font-semibold text-xl">
            Résultats en temps réel
          </h2>
          {candidates
            .sort((a, b) => b.total_votes - a.total_votes)
            .map((candidate, idx) => {
              const candidateImage = images.find(
                (img) => img.numero === candidate.numero
              );
              const percentage =
                totalVotes > 0
                  ? Math.round((candidate.total_votes / totalVotes) * 100)
                  : 0;

              return (
                <div key={candidate.id} className="flex items-center gap-4">
                  <span className="text-lg font-bold">{idx + 1}</span>
                  <div className="flex gap-4 items-center w-full">
                    <div
                      className={clsx(
                        "w-20 h-20 rounded-full overflow-hidden relative flex-none",
                        idx === 0 && percentage > 0 && "p-1 bg-yellow-400"
                      )}
                    >
                      {candidateImage?.image && (
                        <Image
                          src={candidateImage.image}
                          alt={`Photo de ${candidate.name}`}
                          className="object-cover w-full h-full rounded-full"
                          width={80}
                          height={80}
                          priority
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <span className="font-semibold text-lg">
                        {candidate.name}
                      </span>
                      <div className="w-full h-11 flex items-center bg-slate-200 rounded-full overflow-hidden relative">
                        {percentage > 0 && (
                          <div
                            className={clsx(
                              "absolute inset-0 bg-cblue-light h-full rounded-full transition-all duration-300 flex items-center px-2 justify-end",
                              idx === 0 && "bg-yellow-400"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <span className="relative z-10 pl-8">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      </main>
    </>
  );
}
