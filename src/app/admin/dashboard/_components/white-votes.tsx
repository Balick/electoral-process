"use client";

import { createClient } from "@/lib/supabase/client";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhiteVotes() {
  const supabase = createClient();
  const [totalVoters, setTotalVoters] = useState(0);

  useEffect(() => {
    const fetchVotersData = async () => {
      const { data, error } = await supabase
        .from("electeurs")
        .select("*")
        .eq("a_vote", true)
        .filter("id_candidat", "is", null);

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return;
      }

      const { data: candidatesData, error: erroCandidates } = await supabase
        .from("candidates")
        .select("*")
        .eq("a_vote", true)
        .filter("id_candidat", "is", null);

      if (erroCandidates) {
        console.error("Erreur lors de la récupération des données :", error);
        return;
      }

      setTotalVoters(data.length + candidatesData.length);
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
        () => fetchVotersData()
      )
      .subscribe();

    const channel2 = supabase
      .channel("public:candidates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "candidates",
        },
        () => fetchVotersData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channel2);
    };
  }, []);

  return (
    <div className="w-full border border-black rounded-lg p-4 ">
      <div className="flex justify-between items-center gap-2">
        <span className="text-nowrap">Vote blanc</span>
        <Ban className="w-4 h-4" />
      </div>
      <span className="font-semibold text-3xl block">{totalVoters}</span>
    </div>
  );
}
