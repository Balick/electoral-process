"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {images} from "@/constants";
import {createClient} from "@/lib/supabase/client";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function CandidateList() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const updateData = async (realTimeData?: any | null) => {
      if (realTimeData) {
        const newData = Array.isArray(realTimeData) ? realTimeData : [realTimeData];
        setData(newData);
        return;
      }

      const {data: candidates, error} = await supabase
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
      }
    };

    updateData();

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
          updateData(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="w-full lg:basis-[40%] h-[440px] border-black overflow-auto">
      <CardHeader>
        <CardTitle className="text-lg">Liste des candidats</CardTitle>
        <CardDescription className="text-base -translate-y-2">
          Les résultats en temps réel pour chaque candidat
        </CardDescription>
      </CardHeader>
      <CardContent className="-translate-y-4">
        <ol className="flex flex-col gap-2">
          {data?.sort((a, b) => b.total_votes - a.total_votes)
            .map((candidate: any, idx) => {
              const image = images.find(
                (image: any) => image.numero === candidate.numero
              );

              return (
                <li key={idx} className="flex items-center gap-2">
                  <span className="hidden">{idx + 1}</span>
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative flex-none">
                      {image && (
                        <Image
                          src={image.image}
                          alt={candidate.nom}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="flex flex-col lg:flex-row lg:gap-2 lg:justify-between w-full">
                      <span className="text-nowrap">{candidate.nom}</span>
                      <span>{candidate.total_votes} voix</span>
                    </div>
                  </div>
                </li>
              );
            })}
        </ol>
      </CardContent>
    </Card>
  );
}
