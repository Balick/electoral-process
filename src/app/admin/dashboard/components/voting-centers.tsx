"use client";

import { Home } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VotingCenters() {
  const supabase = createClient();
  const [totalVoters, setTotalVoters] = useState(0);
  const [percentageNotVoted, setPercentageNotVoted] = useState(0);

  useEffect(() => {
    const fetchVotersData = async () => {
      const { data, error } = await supabase
        .from("centres")
        .select("total_votes");

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return;
      }

      const total = data.length;
      if (total > 0) {
        const notVoted = data.filter(
          (centre) => centre.total_votes === 0
        ).length;
        const percentage = parseFloat(((notVoted / total) * 100).toFixed(2));
        setPercentageNotVoted(percentage);
      } else {
        setPercentageNotVoted(0);
      }

      setTotalVoters(total);
    };

    fetchVotersData();

    const channel = supabase
      .channel("public:centres")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "centres",
        },
        (payload) => {
          fetchVotersData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full border border-black rounded-lg p-4 ">
      <div className="flex justify-between items-center gap-2">
        <span className="text-nowrap">Centres de votes</span>
        <Home className="w-4 h-4" />
      </div>
      <span className="font-semibold text-3xl block">{totalVoters}</span>
      <span className="text-sm -mt-1 block">
        {percentageNotVoted}% n&apos;ont pas voté
      </span>
    </div>
  );
}
