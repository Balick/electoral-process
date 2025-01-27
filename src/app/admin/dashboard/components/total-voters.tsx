"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export default function TotalVoters() {
  const supabase = createClient();
  const [totalVoters, setTotalVoters] = useState(0);
  const [percentageNotVoted, setPercentageNotVoted] = useState(0);

  useEffect(() => {
    const fetchVotersData = async () => {
      const { data: electeursData, error: electeursError } = await supabase
        .from("electeurs")
        .select("a_vote");

      const { data: candidatesData, error: candidatesError } = await supabase
        .from("candidates")
        .select("a_vote");

      if (electeursError || candidatesError) {
        console.error(
          "Erreur lors de la récupération des données :",
          electeursError || candidatesError
        );
        return;
      }

      const combinedData = [
        ...(candidatesData || []),
        ...(electeursData || []),
      ];

      const total = combinedData.length;

      if (total > 0) {
        const notVoted = combinedData.filter((voter) => !voter.a_vote).length;
        const percentage = parseFloat(((notVoted / total) * 100).toFixed(2));
        setPercentageNotVoted(percentage);
      } else {
        setPercentageNotVoted(0);
      }

      setTotalVoters(total);
    };

    fetchVotersData();

    const channel1 = supabase
      .channel("public:candidates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "candidates",
        },
        () => {
          fetchVotersData();
        }
      )
      .subscribe();

    const channel2 = supabase
      .channel("public:electeurs")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "electeurs",
        },
        () => {
          fetchVotersData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [supabase]);

  return (
    <div className="w-full border border-black rounded-lg p-4 ">
      <div className="flex justify-between items-center gap-2">
        <span className="text-nowrap">Total des électeurs</span>
        <User className="w-4 h-4" />
      </div>
      <span className="font-semibold text-3xl block">{totalVoters}</span>
      <span className="text-sm -mt-1 block">
        {percentageNotVoted}% n&apos;ont pas voté
      </span>
    </div>
  );
}
