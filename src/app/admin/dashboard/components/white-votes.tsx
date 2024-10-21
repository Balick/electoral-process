"use client";

import { createClient } from "@/lib/supabase/client";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhiteVotes() {
  const supabase = createClient();
  const [totalVoters, setTotalVoters] = useState(0);
  const [percentageNotVoted, setPercentageNotVoted] = useState(0);

  useEffect(() => {
    const fetchVotersData = async () => {
      const { data, error } = await supabase
        .from("electeurs")
        .select("*")
        .eq("a_vote", true);

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return;
      }

      const total = data.length;

      if (total > 0) {
        const notVoted = data.filter(
          (electeur) =>
            electeur.a_vote === true && electeur.id_candidat === null
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
      .channel("public:electeurs")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "electeurs",
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
        <span className="text-nowrap">Vote blanc</span>
        <Ban className="w-4 h-4" />
      </div>
      <span className="font-semibold text-3xl block">{totalVoters}</span>
      <span className="text-sm -mt-1 block">47% n&apos;ont pas voté</span>
    </div>
  );
}
