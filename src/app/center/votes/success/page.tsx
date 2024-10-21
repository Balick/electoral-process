"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { images } from "@/constants";
import Timer from "@/app/admin/dashboard/components/timer";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import DateTime from "@/components/date-time";

export default function SuccessPage() {
  const supabase = createClient();
  const [data, setData] = useState<any[] | null>([]);
  const [totalCandidatesVote, setTotalCandidatesVote] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: candidates, error } = await supabase
        .from("candidates")
        .select("*");

      if (error) {
        console.error(
          "❌  Erreur lors de la récupération des données: ",
          error.message
        );
      }

      if (candidates) {
        setData(candidates);
        setTotalCandidatesVote(
          candidates.reduce((acc, candidate) => acc + candidate.total_votes, 0)
        );
      }
    };

    const checkSessionStatus = async () => {
      const { data: session, error: sessionError } = await supabase
        .from("duree")
        .select("*")
        .single();

      if (sessionError) {
        console.error(
          "❌  Erreur lors de la récupération de la session: ",
          sessionError.message
        );
      }

      if (session) {
        setIsEnded(session.fin_session);
      }
    };

    fetchData();
    checkSessionStatus();

    const channel = supabase
      .channel("results")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "candidates",
        },
        (payload) => {
          fetchData();
        }
      )
      .subscribe();

    const channel2 = supabase
      .channel("session")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "duree" },
        (payload) => {
          checkSessionStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channel2);
    };
  }, [supabase]);

  return (
    <>
      <div className="px-8 py-4 fixed inset-x-0 top-0 z-10">
        <nav>
          <ul className="flex items-center justify-between font-semibold uppercase">
            <li>
              <header className="uppercase text-2xl font-bold">CENI</header>
            </li>
            <li>
              <DateTime />
            </li>
          </ul>
        </nav>
      </div>
      <div className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col lg:flex-row items-center pt-20 px-8 bg-gray-100">
        <div className="lg:w-[30%] flex-none flex flex-col items-center justify-center gap-2">
          <Clock className={cn("w-16 h-16", !isEnded && "animate-spin-slow")} />
          <p className="font-semibold text-lg uppercase">
            Il reste <Timer />
          </p>
        </div>
        <div className="space-y-2 w-full">
          <h1 className="uppercase font-semibold text-lg">
            Résultat en temps réel
          </h1>
          {data
            ?.sort((a, b) => b.total_votes - a.total_votes) // Tri par ordre décroissant
            .map((candidate: any, idx) => {
              const image = images.find(
                (image: any) => image.numero === candidate.numero
              );

              const percentage = Math.round(
                (candidate.total_votes / totalCandidatesVote) * 100
              );

              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-lg font-bold">{idx + 1}</span>
                  <div className="flex gap-2 items-center w-full">
                    <div className="w-20 h-20 rounded-full overflow-hidden relative flex-none">
                      {image?.image && (
                        <Image
                          src={image.image}
                          alt="president image"
                          className="object-cover w-full h-full"
                          width={100}
                          height={100}
                          priority
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 justify-center w-full">
                      <span className="font-semibold text-lg">
                        {candidate.name}
                      </span>
                      <div className="w-full h-11 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="bg-cblue-light h-full rounded-full transition-all duration-300 flex items-center px-2 justify-end"
                          style={{ width: `${candidate.total_votes}%` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
