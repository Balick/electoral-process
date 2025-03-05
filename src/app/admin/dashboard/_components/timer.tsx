"use client";

import { createClient } from "@/lib/supabase/client";
import { calculateTimeLeft, cn, formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Timer({ className }: { className?: string }) {
  const supabase = createClient();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("duree")
          .select("id, fin, end_session")
          .eq("id", 1)
          .single();

        if (error || !data) {
          console.error("Erreur lors de la récupération des données :", error);
          return;
        }

        const endDate = new Date(data.fin);
        const now = new Date();

        const updateTimeLeft = () => {
          const timeRemaining = calculateTimeLeft(endDate);
          setTimeLeft(timeRemaining);

          if (
            timeRemaining.hours === 0 &&
            timeRemaining.minutes === 0 &&
            timeRemaining.seconds === 0
          ) {
            clearInterval(interval);
            if (!data.end_session) {
              updateEndSession(data.id);
            }
          }
        };

        updateTimeLeft();

        if (now < endDate) {
          interval = setInterval(updateTimeLeft, 1000);
        } else {
          if (!data.end_session) {
            updateEndSession(data.id);
          }
        }
      } catch (error) {
        console.error("Erreur dans fetchData :", error);
      }
    };

    const updateEndSession = async (id: string) => {
      await supabase.from("duree").update({ end_session: true }).eq("id", id);
    };

    fetchData();

    const channel = supabase
      .channel("public:duree:id=eq.1")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "duree",
          filter: "id=eq.1",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <span className={cn("font-semibold text-3xl block", className)}>
      {`${formatTime(timeLeft.hours)}h:${formatTime(
        timeLeft.minutes
      )}m:${formatTime(timeLeft.seconds)}s`}
    </span>
  );
}
